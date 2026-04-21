import {
  articleImportsTable,
  articlesTable,
  categoriesTable,
  db,
  sourcesTable,
  usersTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";
import { classifyAndRewriteContent } from "../../services/ai.service";
import { uploadImageToFtp } from "../../services/ftp.service";
import { parseRssFeed } from "../../services/rss.service";

const router: IRouter = Router();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface FetchSourceResult {
  sourceId: string;
  sourceName: string;
  fetched: number;
  saved: number;
  skipped: number;
  filtered: number;
  failed: number;
  errors: string[];
}

async function fetchAndSaveSource(
  sourceId: string
): Promise<FetchSourceResult> {
  const result: FetchSourceResult = {
    sourceId,
    sourceName: "",
    fetched: 0,
    saved: 0,
    skipped: 0,
    filtered: 0,
    failed: 0,
    errors: [],
  };

  try {
    // Load source
    const sources = await db
      .select()
      .from(sourcesTable)
      .where(eq(sourcesTable.id, sourceId))
      .limit(1);

    if (sources.length === 0) {
      throw new Error(`Source ${sourceId} not found`);
    }

    const source = sources[0];
    result.sourceName = source.name;

    if (!source.isActive) {
      throw new Error(`Source ${source.name} is not active`);
    }

    // Load filterable categories
    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.isFilterable, true));

    if (categories.length === 0) {
      throw new Error("No filterable categories found");
    }

    // Load admin user (for author assignment)
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "ADMIN"))
      .limit(1);

    if (users.length === 0) {
      throw new Error("No admin user found");
    }

    const author = users[0];

    // Fetch and parse RSS feed
    const items = await parseRssFeed(source.rssUrl);
    result.fetched = items.length;

    if (items.length === 0) {
      return result;
    }

    // Get existing external IDs for deduplication
    const existingImports = await db
      .select({ externalId: articleImportsTable.externalId })
      .from(articleImportsTable)
      .where(eq(articleImportsTable.sourceId, sourceId));

    const existingIds = new Set(existingImports.map((imp) => imp.externalId));

    // Process each item
    for (const item of items || []) {
      console.log("Processing item:", item);
      console.log("Existing IDs:", existingIds.has(item.externalId));
      try {
        // Skip duplicates
        if (existingIds.has(item.externalId)) {
          result.skipped++;
          continue;
        }

        // Skip items without images
        if (!item.imageUrl) {
          result.skipped++;
          continue;
        }

        // Create import record
        const [importRecord] = await db
          .insert(articleImportsTable)
          .values({
            sourceId: source.id,
            externalId: item.externalId,
            originalUrl: item.link,
            publishedAt: item.publishedAt,
            status: "FETCHED",
          })
          .returning();

        // Classify content using AI
        const classification = await classifyAndRewriteContent(
          item.title,
          item.description || "",
          categories
        );

        // If no category match, mark as filtered
        if (!classification.categoryId) {
          await db
            .update(articleImportsTable)
            .set({ status: "FILTERED" })
            .where(eq(articleImportsTable.id, importRecord.id));
          result.filtered++;
          continue;
        }

        // Upload image via FTP
        const uploadedImageUrl = await uploadImageToFtp({
          imageUrl: item.imageUrl,
          fileNamePrefix: classification.rewrittenTitle,
        });

        // Create article
        const slug = generateSlug(classification.rewrittenTitle);
        const [article] = await db
          .insert(articlesTable)
          .values({
            authorId: author.id,
            sourceId: source.id,
            categoryId: classification.categoryId,
            title: classification.rewrittenTitle,
            slug,
            aiSummary:
              classification.shortDescription || classification.description,
            summaryPoints: classification.summaryPoints,
            featuredImage: uploadedImageUrl,
            sourceUrl: item.link,
            sourceName: source.name,
            status: "PUBLISHED",
            isFeatured: false,
            publishedAt: item.publishedAt || new Date(),
          })
          .returning();

        // Link import to article
        await db
          .update(articleImportsTable)
          .set({
            status: "PROCESSED",
            articleId: article.id,
          })
          .where(eq(articleImportsTable.id, importRecord.id));

        result.saved++;
      } catch (error) {
        result.failed++;
        result.errors.push(
          `[${item.externalId}] Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        console.error(`Error processing item ${item.externalId}:`, error);
      }
    }

    // Update source's lastFetchedAt
    await db
      .update(sourcesTable)
      .set({ lastFetchedAt: new Date() })
      .where(eq(sourcesTable.id, sourceId));
  } catch (error) {
    throw error;
  }

  return result;
}

export { fetchAndSaveSource };

// POST /feeds - Fetch from single source
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceId } = req.body;

    if (!sourceId) {
      res.status(400).json({
        statusCode: 400,
        statusMessage: "sourceId is required",
      });
      return;
    }

    const result = await fetchAndSaveSource(sourceId);

    res.json({
      success: true,
      message: `Fetched ${result.saved} new articles from ${result.sourceName}`,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching from source:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch from source";
    res.status(500).json({
      statusCode: 500,
      statusMessage: message,
    });
  }
});

// POST /feeds/fetch-all - Fetch from all sources
router.post(
  "/fetch-all",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all active sources
      const sources = await db
        .select()
        .from(sourcesTable)
        .where(eq(sourcesTable.isActive, true));

      if (sources.length === 0) {
        res.json({
          success: true,
          message: "No active sources found",
          data: [],
          metadata: {
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      const results: FetchSourceResult[] = [];
      let totalSaved = 0;
      let totalSkipped = 0;
      let totalFiltered = 0;
      let totalFailed = 0;

      // Process each source sequentially
      for (const source of sources) {
        try {
          const result = await fetchAndSaveSource(source.id);
          results.push(result);
          totalSaved += result.saved;
          totalSkipped += result.skipped;
          totalFiltered += result.filtered;
          totalFailed += result.failed;
        } catch (error) {
          console.error(`Error processing source ${source.id}:`, error);
          results.push({
            sourceId: source.id,
            sourceName: source.name,
            fetched: 0,
            saved: 0,
            skipped: 0,
            filtered: 0,
            failed: 0,
            errors: [error instanceof Error ? error.message : "Unknown error"],
          });
        }
      }

      res.json({
        success: true,
        message: `Processed ${sources.length} sources: ${totalSaved} saved, ${totalSkipped} duplicates, ${totalFiltered} filtered (no category match), ${totalFailed} failed`,
        data: results,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error fetching from all sources:", error);
      res.status(500).json({
        statusCode: 500,
        statusMessage: "Failed to fetch from all sources",
      });
    }
  }
);

export default router;

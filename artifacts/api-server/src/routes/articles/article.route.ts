import { db, articlesTable, usersTable, sourcesTable, categoriesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, and, sql } from "drizzle-orm";

const router: IRouter = Router();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /articles - List all articles with optional filtering and pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      categoryId,
      sourceId,
      authorId,
      isFeatured,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Build conditions
    const conditions: any[] = [];
    if (status) {
      conditions.push(eq(articlesTable.status, status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"));
    }
    if (categoryId) {
      conditions.push(eq(articlesTable.categoryId, categoryId as string));
    }
    if (sourceId) {
      conditions.push(eq(articlesTable.sourceId, sourceId as string));
    }
    if (authorId) {
      conditions.push(eq(articlesTable.authorId, authorId as string));
    }
    if (isFeatured !== undefined) {
      conditions.push(eq(articlesTable.isFeatured, isFeatured === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(articlesTable)
      .where(whereClause);

    const total = Number(result[0]?.count || 0);

    // Get articles with relations
    const articles = await db
      .select({
        id: articlesTable.id,
        authorId: articlesTable.authorId,
        sourceId: articlesTable.sourceId,
        categoryId: articlesTable.categoryId,
        title: articlesTable.title,
        slug: articlesTable.slug,
        summaryPoints: articlesTable.summaryPoints,
        sourceUrl: articlesTable.sourceUrl,
        sourceName: articlesTable.sourceName,
        aiSummary: articlesTable.aiSummary,
        featuredImage: articlesTable.featuredImage,
        status: articlesTable.status,
        isFeatured: articlesTable.isFeatured,
        publishedAt: articlesTable.publishedAt,
        createdAt: articlesTable.createdAt,
        updatedAt: articlesTable.updatedAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
        source: {
          id: sourcesTable.id,
          name: sourcesTable.name,
          websiteUrl: sourcesTable.websiteUrl,
        },
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(sourcesTable, eq(articlesTable.sourceId, sourcesTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .orderBy(desc(articlesTable.createdAt))
      .limit(limitNum)
      .offset(offset);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: "Articles retrieved successfully",
      data: articles,
      metadata: {
        timestamp: new Date().toISOString(),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch articles",
    });
  }
});

// GET /articles/:id - Get single article with full relations
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const articles = await db
      .select({
        id: articlesTable.id,
        authorId: articlesTable.authorId,
        sourceId: articlesTable.sourceId,
        categoryId: articlesTable.categoryId,
        title: articlesTable.title,
        slug: articlesTable.slug,
        summaryPoints: articlesTable.summaryPoints,
        sourceUrl: articlesTable.sourceUrl,
        sourceName: articlesTable.sourceName,
        aiSummary: articlesTable.aiSummary,
        featuredImage: articlesTable.featuredImage,
        status: articlesTable.status,
        isFeatured: articlesTable.isFeatured,
        publishedAt: articlesTable.publishedAt,
        createdAt: articlesTable.createdAt,
        updatedAt: articlesTable.updatedAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
        source: {
          id: sourcesTable.id,
          name: sourcesTable.name,
          websiteUrl: sourcesTable.websiteUrl,
        },
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(sourcesTable, eq(articlesTable.sourceId, sourcesTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(eq(articlesTable.id, id))
      .limit(1);

    if (articles.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Article not found",
      });
      return;
    }

    const article = articles[0];

    res.json({
      success: true,
      message: "Article retrieved successfully",
      data: article,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch article",
    });
  }
});

// POST /articles - Create article
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      authorId,
      title,
      slug,
      excerpt,
      content,
      summaryPoints,
      sourceUrl,
      sourceName,
      aiRewrittenTitle,
      aiSummary,
      featuredImage,
      featuredImageAlt,
      status,
      isFeatured,
      publishedAt,
      sourceId,
      categoryId,
    } = req.body;

    if (!authorId || !title) {
      res.status(400).json({
        error: true,
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "authorId and title are required",
      });
      return;
    }

    const articleSlug = slug || generateSlug(title);

    const [article] = await db
      .insert(articlesTable)
      .values({
        authorId,
        title,
        slug: articleSlug,
        summaryPoints: summaryPoints || undefined,
        sourceUrl: sourceUrl || undefined,
        sourceName: sourceName || undefined,
        aiSummary: aiSummary || undefined,
        featuredImage: featuredImage || undefined,
        status: (status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
        isFeatured: isFeatured || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        sourceId: sourceId || undefined,
        categoryId: categoryId || undefined,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to create article",
    });
  }
});

// PATCH /articles/:id - Update article
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const {
      title,
      slug,
      excerpt,
      content,
      summaryPoints,
      sourceUrl,
      sourceName,
      aiRewrittenTitle,
      aiSummary,
      featuredImage,
      featuredImageAlt,
      status,
      isFeatured,
      publishedAt,
      sourceId,
      categoryId,
    } = req.body;

    const existing = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Article not found",
      });
      return;
    }

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = slug || generateSlug(title);
    }
    if (slug) updateData.slug = slug;
    if (summaryPoints) updateData.summaryPoints = summaryPoints;
    if (sourceUrl) updateData.sourceUrl = sourceUrl;
    if (sourceName) updateData.sourceName = sourceName;
    if (aiSummary) updateData.aiSummary = aiSummary;
    if (featuredImage) updateData.featuredImage = featuredImage;
    if (status) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (publishedAt) updateData.publishedAt = new Date(publishedAt);
    if (sourceId) updateData.sourceId = sourceId;
    if (categoryId) updateData.categoryId = categoryId;

    const [article] = await db
      .update(articlesTable)
      .set(updateData)
      .where(eq(articlesTable.id, id))
      .returning();

    res.json({
      success: true,
      message: "Article updated successfully",
      data: article,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to update article",
    });
  }
});

// DELETE /articles/:id - Delete article
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Article not found",
      });
      return;
    }

    await db.delete(articlesTable).where(eq(articlesTable.id, id));

    res.json({
      success: true,
      message: "Article deleted successfully",
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to delete article",
    });
  }
});

export default router;

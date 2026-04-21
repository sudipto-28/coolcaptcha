import { db, sourcesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /sources - Get all sources
router.get("/", async (_req: Request, res: Response) => {
  try {
    const sources = await db.select().from(sourcesTable).orderBy(sourcesTable.name);
    res.json({
      success: true,
      message: "Sources retrieved successfully",
      data: sources,
      meta: {
        total: sources.length,
      },
    });
  } catch (error) {
    console.error("Error fetching sources:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sources",
    });
  }
});

// GET /sources/:id - Get single source
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sources = await db
      .select()
      .from(sourcesTable)
      .where(eq(sourcesTable.id, id))
      .limit(1);

    if (sources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    res.json({
      success: true,
      message: "Source retrieved successfully",
      data: sources[0],
    });
  } catch (error) {
    console.error("Error fetching source:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch source",
    });
  }
});

// POST /sources - Create source
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, rssUrl, websiteUrl, isActive, fetchInterval } = req.body;

    if (!name || !rssUrl) {
      return res.status(400).json({
        success: false,
        message: "Name and rssUrl are required",
      });
    }

    const slug = generateSlug(name);

    const [source] = await db
      .insert(sourcesTable)
      .values({
        name,
        slug,
        rssUrl,
        websiteUrl,
        isActive: isActive ?? true,
        fetchInterval: fetchInterval ?? 20,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Source created successfully",
      data: source,
    });
  } catch (error) {
    console.error("Error creating source:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create source",
    });
  }
});

// PUT /sources/:id - Update source
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, slug, rssUrl, websiteUrl, isActive, fetchInterval } = req.body;

    const existing = await db
      .select()
      .from(sourcesTable)
      .where(eq(sourcesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    const [source] = await db
      .update(sourcesTable)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(rssUrl && { rssUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(fetchInterval !== undefined && { fetchInterval }),
      })
      .where(eq(sourcesTable.id, id))
      .returning();

    res.json({
      success: true,
      message: "Source updated successfully",
      data: source,
    });
  } catch (error) {
    console.error("Error updating source:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update source",
    });
  }
});

// DELETE /sources/:id - Delete source
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db
      .select()
      .from(sourcesTable)
      .where(eq(sourcesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    await db.delete(sourcesTable).where(eq(sourcesTable.id, id));

    res.json({
      success: true,
      message: "Source deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting source:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete source",
    });
  }
});

export default router;

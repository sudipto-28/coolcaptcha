import { db, redirectUrlsTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// GET /redirect-urls - List all redirect URLs
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const redirectUrls = await db
      .select()
      .from(redirectUrlsTable)
      .orderBy(desc(redirectUrlsTable.createdAt));

    res.json({
      success: true,
      message: "Redirect URLs retrieved successfully",
      data: redirectUrls,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching redirect URLs:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch redirect URLs",
    });
  }
});

// GET /redirect-urls/:id - Get single redirect URL
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const redirectUrls = await db
      .select()
      .from(redirectUrlsTable)
      .where(eq(redirectUrlsTable.id, id))
      .limit(1);

    if (redirectUrls.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Redirect URL not found",
      });
      return;
    }

    const redirectUrl = redirectUrls[0];

    res.json({
      success: true,
      message: "Redirect URL retrieved successfully",
      data: redirectUrl,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching redirect URL:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch redirect URL",
    });
  }
});

// GET /redirect-urls/active - Get active redirect URL (for captcha redirect)
router.get("/active/random", async (req: Request, res: Response): Promise<void> => {
  try {
    const redirectUrls = await db
      .select()
      .from(redirectUrlsTable)
      .where(eq(redirectUrlsTable.isActive, true))
      .orderBy(desc(redirectUrlsTable.createdAt));

    if (redirectUrls.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "No active redirect URLs found",
      });
      return;
    }

    // Return a random active redirect URL
    const randomIndex = Math.floor(Math.random() * redirectUrls.length);
    const redirectUrl = redirectUrls[randomIndex];

    res.json({
      success: true,
      message: "Active redirect URL retrieved successfully",
      data: redirectUrl,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching active redirect URL:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch active redirect URL",
    });
  }
});

// POST /redirect-urls - Create redirect URL
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, redirectUrl, isActive } = req.body;

    if (!redirectUrl) {
      res.status(400).json({
        error: true,
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "redirectUrl is required",
      });
      return;
    }

    const [newRedirectUrl] = await db
      .insert(redirectUrlsTable)
      .values({
        name: name || null,
        redirectUrl,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Redirect URL created successfully",
      data: newRedirectUrl,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating redirect URL:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to create redirect URL",
    });
  }
});

// PATCH /redirect-urls/:id - Update redirect URL
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, redirectUrl, isActive } = req.body;

    const existing = await db
      .select()
      .from(redirectUrlsTable)
      .where(eq(redirectUrlsTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Redirect URL not found",
      });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (redirectUrl !== undefined) updateData.redirectUrl = redirectUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    const [updatedRedirectUrl] = await db
      .update(redirectUrlsTable)
      .set(updateData)
      .where(eq(redirectUrlsTable.id, id))
      .returning();

    res.json({
      success: true,
      message: "Redirect URL updated successfully",
      data: updatedRedirectUrl,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating redirect URL:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to update redirect URL",
    });
  }
});

// DELETE /redirect-urls/:id - Delete redirect URL
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db
      .select()
      .from(redirectUrlsTable)
      .where(eq(redirectUrlsTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Redirect URL not found",
      });
      return;
    }

    await db.delete(redirectUrlsTable).where(eq(redirectUrlsTable.id, id));

    res.json({
      success: true,
      message: "Redirect URL deleted successfully",
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error deleting redirect URL:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to delete redirect URL",
    });
  }
});

export default router;

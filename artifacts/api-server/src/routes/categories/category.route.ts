import { db, categoriesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /categories - Get all categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    return res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      metadata: {
        timestamp: new Date().toISOString(),
        total: categories.length,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch categories",
    });
  }
});

// GET /categories/:id - Get single category with articles
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1);

    if (categories.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Category not found",
      });
      return;
    }

    const category = categories[0];

    // TODO: Add articles relation when articles are implemented
    // For now, return category without articles
    res.json({
      success: true,
      message: "Category retrieved successfully",
      data: {
        ...category,
        articles: [],
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch category",
    });
  }
});

// POST /categories - Create category
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        error: true,
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Name is required",
      });
      return;
    }

    const slug = generateSlug(name);

    const [category] = await db
      .insert(categoriesTable)
      .values({
        name,
        slug,
        description: description || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to create category",
    });
  }
});

// PATCH /categories/:id - Update category
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, slug, description } = req.body;

    const existing = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Category not found",
      });
      return;
    }

    const [category] = await db
      .update(categoriesTable)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      })
      .where(eq(categoriesTable.id, id))
      .returning();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to update category",
    });
  }
});

// DELETE /categories/:id - Delete category
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({
        error: true,
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Category not found",
      });
      return;
    }

    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to delete category",
    });
  }
});

export default router;

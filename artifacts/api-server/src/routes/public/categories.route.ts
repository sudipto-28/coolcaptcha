import { db, categoriesTable, articlesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, sql, desc } from "drizzle-orm";

const router: IRouter = Router();

// GET /public/categories - List filterable categories with at least one published article
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get categories that are filterable and have at least one published article
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        articleCount: sql<number>`count(${articlesTable.id})`,
      })
      .from(categoriesTable)
      .leftJoin(articlesTable, and(
        eq(articlesTable.categoryId, categoriesTable.id),
        eq(articlesTable.status, "PUBLISHED")
      ))
      .where(eq(categoriesTable.isFilterable, true))
      .groupBy(categoriesTable.id, categoriesTable.name, categoriesTable.slug, categoriesTable.description)
      .having(sql`count(${articlesTable.id}) > 0`)
      .orderBy(categoriesTable.name);

    res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      metadata: {
        total: categories.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

export default router;

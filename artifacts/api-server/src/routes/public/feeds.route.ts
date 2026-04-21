import { db, articlesTable, usersTable, categoriesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

// GET /public/feeds - Get content feed (featured + latest articles)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      featuredLimit = "5",
      latestLimit = "10",
    } = req.query;

    const featuredLimitNum = parseInt(featuredLimit as string, 10) || 5;
    const latestLimitNum = parseInt(latestLimit as string, 10) || 10;

    // Get featured articles (isFeatured: true, status: PUBLISHED)
    const featuredArticles = await db
      .select({
        id: articlesTable.id,
        title: articlesTable.title,
        slug: articlesTable.slug,
        aiSummary: articlesTable.aiSummary,
        summaryPoints: articlesTable.summaryPoints,
        featuredImage: articlesTable.featuredImage,
        isFeatured: articlesTable.isFeatured,
        publishedAt: articlesTable.publishedAt,
        sourceName: articlesTable.sourceName,
        sourceUrl: articlesTable.sourceUrl,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        },
        author: {
          id: usersTable.id,
          name: usersTable.name,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(and(
        eq(articlesTable.status, "PUBLISHED"),
        eq(articlesTable.isFeatured, true)
      ))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(featuredLimitNum);

    // Get latest articles (status: PUBLISHED)
    const latestArticles = await db
      .select({
        id: articlesTable.id,
        title: articlesTable.title,
        slug: articlesTable.slug,
        aiSummary: articlesTable.aiSummary,
        summaryPoints: articlesTable.summaryPoints,
        featuredImage: articlesTable.featuredImage,
        isFeatured: articlesTable.isFeatured,
        publishedAt: articlesTable.publishedAt,
        sourceName: articlesTable.sourceName,
        sourceUrl: articlesTable.sourceUrl,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        },
        author: {
          id: usersTable.id,
          name: usersTable.name,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(eq(articlesTable.status, "PUBLISHED"))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(latestLimitNum);

    res.json({
      success: true,
      message: "Feed retrieved successfully",
      data: {
        featured: featuredArticles,
        latest: latestArticles,
      },
      metadata: {
        featuredCount: featuredArticles.length,
        latestCount: latestArticles.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

export default router;

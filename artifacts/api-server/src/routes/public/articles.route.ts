import { db, articlesTable, usersTable, sourcesTable, categoriesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, and, sql, or, like } from "drizzle-orm";

const router: IRouter = Router();

// GET /public/articles - List published articles with optional filtering and pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      categorySlug,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Build conditions - only return PUBLISHED articles
    const conditions: any[] = [
      eq(articlesTable.status, "PUBLISHED"),
    ];

    // Search in titles (case-insensitive)
    if (search) {
      conditions.push(like(articlesTable.title, `%${search}%`));
    }

    // Filter by category slug
    if (categorySlug) {
      conditions.push(eq(categoriesTable.slug, categorySlug as string));
    }

    // Only return articles from filterable categories
    conditions.push(eq(categoriesTable.isFilterable, true));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articlesTable)
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Get articles with relations
    const articles = await db
      .select({
        id: articlesTable.id,
        status: articlesTable.status,
        categoryId: articlesTable.categoryId,
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
        source: {
          id: sourcesTable.id,
          name: sourcesTable.name,
          websiteUrl: sourcesTable.websiteUrl,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(sourcesTable, eq(articlesTable.sourceId, sourcesTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .orderBy(desc(articlesTable.publishedAt))
      .limit(limitNum)
      .offset(offset);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: "Articles retrieved successfully",
      data: articles,
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

// GET /public/articles/:slug - Get published article by slug
router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    const articles = await db
      .select({
        id: articlesTable.id,
        status: articlesTable.status,
        categoryId: articlesTable.categoryId,
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
        source: {
          id: sourcesTable.id,
          name: sourcesTable.name,
          websiteUrl: sourcesTable.websiteUrl,
        },
      })
      .from(articlesTable)
      .leftJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
      .leftJoin(sourcesTable, eq(articlesTable.sourceId, sourcesTable.id))
      .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
      .where(and(eq(articlesTable.slug, slug), eq(articlesTable.status, "PUBLISHED")))
      .limit(1);

    if (articles.length === 0) {
      res.status(404).json({
        statusCode: 404,
        statusMessage: "Article not found",
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
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

export default router;

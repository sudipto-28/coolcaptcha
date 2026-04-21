import { db, articlesTable, categoriesTable, sourcesTable } from "@workspace/db";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, count, and, gte, lte, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /stats - Get admin dashboard statistics
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Get statistics
    const [
      totalPostsResult,
      todayPostsResult,
      yesterdayPostsResult,
      totalCategoriesResult,
      totalActiveSourcesResult,
      latestPosts,
      categoryBreakdown,
      topSources,
    ] = await Promise.all([
      // Total posts
      db
        .select({ count: count() })
        .from(articlesTable)
        .where(eq(articlesTable.status, "PUBLISHED")),

      // Today's posts
      db
        .select({ count: count() })
        .from(articlesTable)
        .where(
          and(
            eq(articlesTable.status, "PUBLISHED"),
            gte(articlesTable.publishedAt, today)
          )
        ),

      // Yesterday's posts (for trend calculation)
      db
        .select({ count: count() })
        .from(articlesTable)
        .where(
          and(
            eq(articlesTable.status, "PUBLISHED"),
            gte(articlesTable.publishedAt, yesterday),
            lte(articlesTable.publishedAt, yesterdayEnd)
          )
        ),

      // Total categories
      db.select({ count: count() }).from(categoriesTable),

      // Active RSS sources
      db.select({ count: count() }).from(sourcesTable).where(eq(sourcesTable.isActive, true)),

      // Latest posts
      db
        .select({
          id: articlesTable.id,
          title: articlesTable.title,
          categoryId: articlesTable.categoryId,
          sourceId: articlesTable.sourceId,
          publishedAt: articlesTable.publishedAt,
          sourceUrl: articlesTable.sourceUrl,
        })
        .from(articlesTable)
        .where(eq(articlesTable.status, "PUBLISHED"))
        .orderBy(desc(articlesTable.publishedAt))
        .limit(5),

      // Category breakdown for today
      db
        .select({
          categoryId: articlesTable.categoryId,
          count: count(),
        })
        .from(articlesTable)
        .where(
          and(
            eq(articlesTable.status, "PUBLISHED"),
            gte(articlesTable.publishedAt, today)
          )
        )
        .groupBy(articlesTable.categoryId),

      // Top RSS sources by post count
      db
        .select({
          id: sourcesTable.id,
          name: sourcesTable.name,
          rssUrl: sourcesTable.rssUrl,
          articleCount: count(articlesTable.id),
        })
        .from(sourcesTable)
        .leftJoin(articlesTable, eq(sourcesTable.id, articlesTable.sourceId))
        .where(eq(sourcesTable.isActive, true))
        .groupBy(sourcesTable.id, sourcesTable.name, sourcesTable.rssUrl)
        .orderBy(desc(count(articlesTable.id)))
        .limit(5),
    ]);

    const totalPosts = totalPostsResult[0]?.count || 0;
    const todayPosts = todayPostsResult[0]?.count || 0;
    const yesterdayPosts = yesterdayPostsResult[0]?.count || 0;
    const totalCategories = totalCategoriesResult[0]?.count || 0;
    const totalActiveSources = totalActiveSourcesResult[0]?.count || 0;

    // Calculate trends (percentage change from yesterday)
    const postsTrend =
      yesterdayPosts > 0
        ? Math.round(((todayPosts - yesterdayPosts) / yesterdayPosts) * 100)
        : todayPosts > 0
          ? 100
          : 0;

    // Fetch categories for latest posts
    const categoryIds = latestPosts
      .map((post: any) => post.categoryId)
      .filter((id: string | null): id is string => id !== null);
    const categories = categoryIds.length > 0
      ? await db
          .select({ id: categoriesTable.id, name: categoriesTable.name })
          .from(categoriesTable)
          .where(eq(categoriesTable.id, categoryIds[0]))
      : [];

    const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

    // Fetch sources for latest posts
    const sourceIds = latestPosts
      .map((post: any) => post.sourceId)
      .filter((id: string | null): id is string => id !== null);
    const sources = sourceIds.length > 0
      ? await db
          .select({ id: sourcesTable.id, name: sourcesTable.name, rssUrl: sourcesTable.rssUrl })
          .from(sourcesTable)
          .where(eq(sourcesTable.id, sourceIds[0]))
      : [];

    const sourceMap = new Map(sources.map((s: any) => [s.id, { name: s.name, rssUrl: s.rssUrl }]));

    // Format latest posts
    const formattedLatestPosts = latestPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      category: post.categoryId ? categoryMap.get(post.categoryId) || "Uncategorized" : "Uncategorized",
      source: post.sourceId ? sourceMap.get(post.sourceId)?.name || "Unknown" : "Unknown",
      publishedAt: formatRelativeTime(post.publishedAt),
      rssUrl: post.sourceId ? sourceMap.get(post.sourceId)?.rssUrl || post.sourceUrl || "#" : post.sourceUrl || "#",
    }));

    // Format category breakdown
    const categoryBreakdownIds = categoryBreakdown
      .map((c: any) => c.categoryId)
      .filter((id: string | null): id is string => id !== null);

    const breakdownCategories =
      categoryBreakdownIds.length > 0
        ? await db
            .select({ id: categoriesTable.id, name: categoriesTable.name })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, categoryBreakdownIds[0]))
        : [];

    const breakdownCategoryMap = new Map(breakdownCategories.map((c: any) => [c.id, c.name]));
    const maxCategoryCount = Math.max(...categoryBreakdown.map((c: any) => c.count), 1);

    const formattedCategoryBreakdown = categoryBreakdown
      .filter((cat: any) => cat.categoryId !== null)
      .map((cat: any) => ({
        name: breakdownCategoryMap.get(cat.categoryId) || "Unknown",
        count: cat.count,
      }))
      .sort((a: any, b: any) => b.count - a.count);

    // Format top sources
    const formattedTopSources = topSources
      .map((source: any) => ({
        id: source.id,
        name: source.name,
        count: source.articleCount,
      }))
      .sort((a: any, b: any) => b.count - a.count);

    const stats = {
      totalPosts,
      todayPosts,
      totalCategories,
      totalActiveSources,
      postsTrend,
    };

    res.json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: {
        stats,
        latestPosts: formattedLatestPosts,
        categoryBreakdown: formattedCategoryBreakdown,
        topSources: formattedTopSources,
        maxCategoryCount,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch statistics",
    });
  }
});

function formatRelativeTime(date: Date | null): string {
  if (!date) return "Unknown";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}

export default router;

import { apiFetch } from "./api-fetch";

export interface Stats {
  totalPosts: number;
  todayPosts: number;
  totalCategories: number;
  totalActiveSources: number;
  postsTrend: number;
}

export interface LatestPost {
  id: string;
  title: string;
  category: string;
  source: string;
  publishedAt: string;
  rssUrl: string;
}

export interface CategoryBreakdown {
  name: string;
  count: number;
}

export interface TopSource {
  id: string;
  name: string;
  count: number;
}

export interface StatsResponse {
  stats: Stats;
  latestPosts: LatestPost[];
  categoryBreakdown: CategoryBreakdown[];
  topSources: TopSource[];
  maxCategoryCount: number;
}

export async function getStats() {
  const response = await apiFetch<{ success: boolean; data: StatsResponse; message: string }>("/api/stats");
  return response.data;
}

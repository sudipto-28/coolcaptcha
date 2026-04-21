import { customFetch } from "@workspace/api-client-react";

export interface Article {
  id: string;
  authorId: string;
  sourceId: string | null;
  categoryId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  summaryPoints: string[] | null;
  sourceUrl: string | null;
  sourceName: string | null;
  aiRewrittenTitle: string | null;
  aiSummary: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string | null;
    email: string;
  };
  source?: {
    id: string;
    name: string;
    websiteUrl: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    timestamp?: string;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

interface ApiListResponse<T> extends ApiResponse<T> {
  metadata: {
    timestamp: string;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateArticleInput {
  authorId: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  summaryPoints?: string[];
  sourceUrl?: string;
  sourceName?: string;
  aiRewrittenTitle?: string;
  aiSummary?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isFeatured?: boolean;
  publishedAt?: string;
  sourceId?: string;
  categoryId?: string;
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  summaryPoints?: string[];
  sourceUrl?: string;
  sourceName?: string;
  aiRewrittenTitle?: string;
  aiSummary?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isFeatured?: boolean;
  publishedAt?: string;
  sourceId?: string;
  categoryId?: string;
}

export interface GetArticlesParams {
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  sourceId?: string;
  authorId?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export async function getArticles(params?: GetArticlesParams) {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.sourceId) queryParams.append("sourceId", params.sourceId);
  if (params?.authorId) queryParams.append("authorId", params.authorId);
  if (params?.isFeatured !== undefined) queryParams.append("isFeatured", String(params.isFeatured));
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `/api/articles${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await customFetch<ApiListResponse<Article[]>>(url, {
    method: "GET",
    responseType: "json",
  });

  return response.data;
}

export async function getArticle(id: string) {
  const response = await customFetch<ApiResponse<Article>>(`/api/articles/${id}`, {
    method: "GET",
    responseType: "json",
  });

  return response.data;
}

export async function createArticle(input: CreateArticleInput) {
  const response = await customFetch<ApiResponse<Article>>("/api/articles", {
    method: "POST",
    body: JSON.stringify(input),
    responseType: "json",
  });

  return response.data;
}

export async function updateArticle(id: string, input: UpdateArticleInput) {
  const response = await customFetch<ApiResponse<Article>>(
    `/api/articles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      responseType: "json",
    }
  );

  return response.data;
}

export async function deleteArticle(id: string) {
  await customFetch<ApiResponse<never>>(`/api/articles/${id}`, {
    method: "DELETE",
    responseType: "json",
  });
}

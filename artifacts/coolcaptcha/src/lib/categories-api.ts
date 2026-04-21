import { apiFetch } from "./api-fetch";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isFilterable: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    timestamp?: string;
    total?: number;
  };
}

interface ApiListResponse<T> extends ApiResponse<T> {
  metadata: {
    timestamp: string;
    total: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

export async function getCategories() {
  const response = await apiFetch<ApiListResponse<Category[]>>("/api/categories");
  return response.data;
}

export async function getCategory(id: string) {
  const response = await apiFetch<ApiResponse<Category & { articles: any[] }>>(`/api/categories/${id}`);
  return response.data;
}

export async function createCategory(input: CreateCategoryInput) {
  const response = await apiFetch<ApiResponse<Category>>("/api/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const response = await apiFetch<ApiResponse<Category>>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteCategory(id: string) {
  await apiFetch<ApiResponse<never>>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}

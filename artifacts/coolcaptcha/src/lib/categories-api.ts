import { customFetch } from "@workspace/api-client-react";

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
  const response = await customFetch<ApiListResponse<Category[]>>("/api/categories", {
    method: "GET",
    responseType: "json",
  });

  return response.data;
}

export async function getCategory(id: string) {
  const response = await customFetch<ApiResponse<Category & { articles: any[] }>>(
    `/api/categories/${id}`,
    {
      method: "GET",
      responseType: "json",
    }
  );

  return response.data;
}

export async function createCategory(input: CreateCategoryInput) {
  const response = await customFetch<ApiResponse<Category>>("/api/categories", {
    method: "POST",
    body: JSON.stringify(input),
    responseType: "json",
  });

  return response.data;
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const response = await customFetch<ApiResponse<Category>>(
    `/api/categories/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      responseType: "json",
    }
  );

  return response.data;
}

export async function deleteCategory(id: string) {
  await customFetch<ApiResponse<never>>(`/api/categories/${id}`, {
    method: "DELETE",
    responseType: "json",
  });
}

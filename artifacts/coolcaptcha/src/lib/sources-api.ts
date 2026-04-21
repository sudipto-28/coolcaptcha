import { apiFetch } from "./api-fetch";

export interface Source {
  id: string;
  name: string;
  slug: string;
  rssUrl: string;
  websiteUrl: string | null;
  isActive: boolean;
  fetchInterval: number;
  lastFetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiListResponse<T> extends ApiResponse<T> {
  meta?: {
    total: number;
  };
}

export interface CreateSourceInput {
  name: string;
  rssUrl: string;
  websiteUrl?: string;
  isActive?: boolean;
  fetchInterval?: number;
}

export interface UpdateSourceInput {
  name?: string;
  slug?: string;
  rssUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
  fetchInterval?: number;
}

export async function getSources() {
  const response = await apiFetch<ApiListResponse<Source[]>>("/api/sources");
  return response.data;
}

export async function createSource(input: CreateSourceInput) {
  const response = await apiFetch<ApiResponse<Source>>("/api/sources", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteSource(id: string) {
  await apiFetch<ApiResponse<never>>(`/api/sources/${id}`, {
    method: "DELETE",
  });
}

export async function updateSource(id: string, input: UpdateSourceInput) {
  const response = await apiFetch<ApiResponse<Source>>(`/api/sources/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return response.data;
}

import { apiFetch } from "./api-fetch";

export interface RedirectUrl {
  id: string;
  name: string | null;
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    timestamp?: string;
  };
}

export interface CreateRedirectUrlInput {
  name?: string;
  redirectUrl: string;
  isActive?: boolean;
}

export interface UpdateRedirectUrlInput {
  name?: string;
  redirectUrl?: string;
  isActive?: boolean;
}

export async function getRedirectUrls() {
  const response = await apiFetch<ApiResponse<RedirectUrl[]>>("/api/redirect-urls");
  return response.data;
}

export async function getRedirectUrl(id: string) {
  const response = await apiFetch<ApiResponse<RedirectUrl>>(`/api/redirect-urls/${id}`);
  return response.data;
}

export async function createRedirectUrl(input: CreateRedirectUrlInput) {
  const response = await apiFetch<ApiResponse<RedirectUrl>>("/api/redirect-urls", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateRedirectUrl(id: string, input: UpdateRedirectUrlInput) {
  const response = await apiFetch<ApiResponse<RedirectUrl>>(`/api/redirect-urls/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deleteRedirectUrl(id: string) {
  await apiFetch<ApiResponse<never>>(`/api/redirect-urls/${id}`, {
    method: "DELETE",
  });
}

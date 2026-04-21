import { customFetch } from "@workspace/api-client-react";

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
  const response = await customFetch<ApiResponse<RedirectUrl[]>>("/api/redirect-urls", {
    method: "GET",
    responseType: "json",
  });

  return response.data;
}

export async function getRedirectUrl(id: string) {
  const response = await customFetch<ApiResponse<RedirectUrl>>(`/api/redirect-urls/${id}`, {
    method: "GET",
    responseType: "json",
  });

  return response.data;
}

export async function createRedirectUrl(input: CreateRedirectUrlInput) {
  const response = await customFetch<ApiResponse<RedirectUrl>>("/api/redirect-urls", {
    method: "POST",
    body: JSON.stringify(input),
    responseType: "json",
  });

  return response.data;
}

export async function updateRedirectUrl(id: string, input: UpdateRedirectUrlInput) {
  const response = await customFetch<ApiResponse<RedirectUrl>>(
    `/api/redirect-urls/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      responseType: "json",
    }
  );

  return response.data;
}

export async function deleteRedirectUrl(id: string) {
  await customFetch<ApiResponse<never>>(`/api/redirect-urls/${id}`, {
    method: "DELETE",
    responseType: "json",
  });
}

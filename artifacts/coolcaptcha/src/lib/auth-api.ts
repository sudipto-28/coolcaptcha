import { customFetch } from "@workspace/api-client-react";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await customFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await customFetch<ApiResponse<User>>("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

import { apiFetch } from "./api-fetch";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  message: string;
  users?: T;
  data?: T;
  success?: boolean;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiFetch<ApiResponse<User[]>>("/api/users");
  return response.users || response.data || [];
}

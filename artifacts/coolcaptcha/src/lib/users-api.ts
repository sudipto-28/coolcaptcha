import { customFetch } from "@workspace/api-client-react";

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
  const response = await customFetch<ApiResponse<User[]>>("/api/users", {
    method: "GET",
  });

  return response.users || response.data || [];
}

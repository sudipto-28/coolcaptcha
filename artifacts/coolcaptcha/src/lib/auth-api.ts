
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
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return response.json() as Promise<LoginResponse>;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch("/api/auth/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data: ApiResponse<User> = await response.json();
  return data.data;
}

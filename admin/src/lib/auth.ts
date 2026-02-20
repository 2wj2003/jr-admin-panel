import { api } from "./api";

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  isAdmin?: boolean;
}

export interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

export async function loginAdmin(identifier: string, password: string): Promise<LoginResponse> {
  const response = await api.post("/admin/login", {
    email: identifier,
    password: password,
  });

  console.log("Login response:", response.data);

  const data = response.data?.data || response.data;
  const token = data?.token || data?.jwt;
  const user = data?.user;

  if (!token) {
    throw new Error("ไม่ได้รับ token จาก API");
  }

  return { jwt: token, user };
}

export async function getMe(): Promise<StrapiUser | null> {
  try {
    const response = await api.get("/admin/users/me");
    return response.data.data;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function setAuthUser(user: StrapiUser) {
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function getAuthUser(): StrapiUser | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("admin_user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  window.location.href = "/login";
}

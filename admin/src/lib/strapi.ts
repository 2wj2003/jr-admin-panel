import { api } from "./api";

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination: StrapiPagination;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

// Content Manager API returns flat objects (not wrapped in { id, attributes })
export interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
}

// Content Manager entity (flat structure)
export interface CMEntity {
  id: number;
  [key: string]: any;
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
    };
    mime: string;
    size: number;
  };
}

// Content Manager API returns media in flat format
export function getStrapiMediaUrl(media: any): string {
  if (!media) return "";
  // Content Manager format: { url: "..." } directly
  const url = media?.url || media?.attributes?.url || "";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  return `${baseUrl}${url}`;
}

// Map of collection names to Strapi UIDs
const COLLECTION_UIDS: Record<string, string> = {
  products: "api::product.product",
  blogs: "api::blog.blog",
  categories: "api::category.category",
  brands: "api::brand.brand",
  pages: "api::page.page",
  showcases: "api::showcase.showcase",
  provinces: "api::province.province",
  "contact-forms": "api::contact-form.contact-form",
  "chat-messages": "api::chat-message.chat-message",
  "chat-sessions": "api::chat-session.chat-session",
};

// Use Content Manager API (admin-authenticated)
export async function fetchCollection(
  endpoint: string,
  params?: Record<string, any>
): Promise<{ data: StrapiEntity[]; meta: StrapiMeta }> {
  const uid = COLLECTION_UIDS[endpoint] || endpoint;

  const flatParams: Record<string, string> = {};
  if (params) {
    const flatten = (obj: any, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}[${key}]` : key;
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "object" && !Array.isArray(value)) {
            flatten(value, fullKey);
          } else if (Array.isArray(value)) {
            value.forEach((v, i) => {
              if (typeof v === "object") flatten(v, `${fullKey}[${i}]`);
              else flatParams[`${fullKey}[${i}]`] = String(v);
            });
          } else {
            flatParams[fullKey] = String(value);
          }
        }
      });
    };
    flatten(params);
  }

  const query = new URLSearchParams(flatParams).toString();

  // Use Public API directly
  const publicUrl = `/api/${endpoint}${query ? `?${query}` : ""}`;
  const response = await api.get(publicUrl);

  // Handle different response formats
  let results, pagination;
  let isPublicApi = false;

  if (response.data?.results) {
    // Content Manager API format: { results: [...flat items...], pagination: {...} }
    results = response.data.results;
    pagination = response.data.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 };
    isPublicApi = false;
  } else if (response.data?.data) {
    // Public API format: { data: [{ id, attributes: {...} }], meta: {...} }
    results = response.data.data;
    pagination = response.data.meta?.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 };
    isPublicApi = true;
  } else if (Array.isArray(response.data)) {
    // Simple array format
    results = response.data;
    pagination = { page: 1, pageSize: results.length, pageCount: 1, total: results.length };
    isPublicApi = false;
  } else {
    results = [];
    pagination = { page: 1, pageSize: 10, pageCount: 1, total: 0 };
    isPublicApi = false;
  }

  // Wrap results to match StrapiEntity format
  // - Content Manager API: item is flat { id, name, ... } → wrap as attributes
  // - Public API: item already has { id, attributes: { name, ... } } → use as-is
  const data: StrapiEntity[] = results.map((item: any) => {
    if (isPublicApi && item.attributes) {
      // Public API already has attributes wrapper
      return { id: item.id, attributes: item.attributes };
    }
    // Content Manager API: flat format, wrap it
    return { id: item.id, attributes: item };
  });

  return {
    data,
    meta: { pagination },
  };
}

export async function fetchSingle(
  endpoint: string,
  id: number,
  params?: Record<string, any>
): Promise<{ data: CMEntity }> {
  const uid = COLLECTION_UIDS[endpoint] || endpoint;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
  }

  const query = searchParams.toString();
  const url = `/content-manager/collection-types/${uid}/${id}${query ? `?${query}` : ""}`;
  const response = await api.get(url);
  return { data: response.data };
}

export async function createEntry(
  endpoint: string,
  data: Record<string, any>
): Promise<{ data: CMEntity }> {
  const uid = COLLECTION_UIDS[endpoint] || endpoint;
  const response = await api.post(`/content-manager/collection-types/${uid}`, data);
  return { data: response.data };
}

export async function updateEntry(
  endpoint: string,
  id: number,
  data: Record<string, any>
): Promise<{ data: CMEntity }> {
  const uid = COLLECTION_UIDS[endpoint] || endpoint;
  const response = await api.put(`/content-manager/collection-types/${uid}/${id}`, data);
  return { data: response.data };
}

export async function deleteEntry(
  endpoint: string,
  id: number
): Promise<void> {
  const uid = COLLECTION_UIDS[endpoint] || endpoint;
  await api.delete(`/content-manager/collection-types/${uid}/${id}`);
}

// ==================== Media / Upload API ====================

export interface MediaFile {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: Record<string, { url: string; width: number; height: number }> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchMediaFiles(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  _q?: string;
  filters?: Record<string, any>;
}): Promise<{ results: MediaFile[]; pagination: StrapiPagination }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?._q) searchParams.set("_q", params._q);

  const query = searchParams.toString();
  const response = await api.get(`/upload/files${query ? `?${query}` : ""}`);

  // Strapi upload API returns array directly or { results, pagination }
  const data = response.data;
  if (Array.isArray(data)) {
    return {
      results: data,
      pagination: { page: 1, pageSize: data.length, pageCount: 1, total: data.length },
    };
  }
  return {
    results: data.results || data,
    pagination: data.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 },
  };
}

export async function uploadFiles(
  files: File[],
  options?: { path?: string; refId?: number; ref?: string; field?: string }
): Promise<MediaFile[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  if (options?.path) formData.append("path", options.path);
  if (options?.refId) formData.append("refId", String(options.refId));
  if (options?.ref) formData.append("ref", options.ref);
  if (options?.field) formData.append("field", options.field);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteMediaFile(id: number): Promise<void> {
  await api.delete(`/upload/files/${id}`);
}

export async function updateMediaFile(
  id: number,
  data: { name?: string; alternativeText?: string; caption?: string }
): Promise<MediaFile> {
  const formData = new FormData();
  const fileInfo: Record<string, string> = {};
  if (data.name !== undefined) fileInfo.name = data.name;
  if (data.alternativeText !== undefined) fileInfo.alternativeText = data.alternativeText;
  if (data.caption !== undefined) fileInfo.caption = data.caption;
  formData.append("fileInfo", JSON.stringify(fileInfo));

  const response = await api.post(`/upload?id=${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// ==================== Admin Users API ====================

export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  isActive: boolean;
  blocked: boolean;
  roles: { id: number; name: string; code: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: number;
  name: string;
  code: string;
  description: string;
}

export async function fetchAdminUsers(): Promise<{ data: { results: AdminUser[] } }> {
  // Try Admin API first, fallback to Public API
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    // Fallback to Public API (if available)
    const response = await api.get("/users");
    const data = Array.isArray(response.data) ? response.data : response.data.results || response.data;
    return { data: { results: data } };
  }
}

export async function fetchAdminUser(id: number): Promise<{ data: AdminUser }> {
  // Try Admin API first, fallback to Public API
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    // Fallback to Public API
    const response = await api.get(`/users/${id}`);
    return { data: response.data };
  }
}

export async function createAdminUser(data: {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  roles: number[];
}): Promise<{ data: AdminUser }> {
  // Try Admin API first, fallback to Public API
  try {
    const response = await api.post("/admin/users", data);
    return response.data;
  } catch (error) {
    // Fallback to Public API
    const response = await api.post("/users", data);
    return { data: response.data };
  }
}

export async function updateAdminUser(
  id: number,
  data: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    roles?: number[];
    isActive?: boolean;
  }
): Promise<{ data: AdminUser }> {
  // Try Admin API first, fallback to Public API
  try {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    // Fallback to Public API
    const response = await api.put(`/users/${id}`, data);
    return { data: response.data };
  }
}

export async function deleteAdminUser(id: number): Promise<void> {
  // Try Admin API first, fallback to Public API
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (error) {
    // Fallback to Public API
    await api.delete(`/users/${id}`);
  }
}

export async function fetchAdminRoles(): Promise<{ data: AdminRole[] }> {
  // Try Admin API first, fallback to Public API
  try {
    const response = await api.get("/admin/roles");
    return { data: response.data?.data || response.data };
  } catch (error) {
    // Fallback to Public API
    const response = await api.get("/roles");
    return { data: response.data?.data || response.data };
  }
}

// ==================== Activity Logging API ====================

export interface ActivityLog {
  id: number;
  action: string;
  entity: string;
  entityId: number;
  entityName: string;
  username: string;
  userId: number;
  timestamp: string;
  details?: Record<string, any>;
}

export async function fetchActivityLogs(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, any>;
}): Promise<{ results: ActivityLog[]; pagination: StrapiPagination }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
  }

  const query = searchParams.toString();
  const response = await api.get(`/activity-logs${query ? `?${query}` : ""}`);
  
  // Handle different response formats
  const data = response.data;
  if (Array.isArray(data)) {
    return {
      results: data,
      pagination: { page: 1, pageSize: data.length, pageCount: 1, total: data.length },
    };
  }
  return {
    results: data.results || data,
    pagination: data.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 },
  };
}

export async function createActivityLog(data: {
  action: string;
  entity: string;
  entityId: number;
  entityName: string;
  username: string;
  userId: number;
  details?: Record<string, any>;
}): Promise<ActivityLog> {
  const response = await api.post("/activity-logs", data);
  return response.data;
}


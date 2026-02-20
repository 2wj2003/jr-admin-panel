import { createActivityLog } from "./strapi";
import { useAuthStore } from "@/store/auth-store";

interface LogData {
  action: string;
  entity: string;
  entityId: number;
  entityName: string;
  details?: Record<string, any>;
}

/**
 * Log user activity automatically
 * Call this function when user performs important actions
 */
export async function logActivity(data: LogData) {
  const { user } = useAuthStore.getState();
  if (!user) return;

  try {
    await createActivityLog({
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      entityName: data.entityName,
      username: user.username || user.email || "Unknown",
      userId: user.id,
      details: data.details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw error to avoid breaking main functionality
  }
}

/**
 * Predefined log actions for common operations
 */
export const LogActions = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LOGIN: "login",
  LOGOUT: "logout",
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  UPLOAD: "upload",
  DOWNLOAD: "download",
  VIEW: "view",
  EXPORT: "export",
  IMPORT: "import",
  SETTINGS_UPDATE: "settings_update",
} as const;

/**
 * Predefined entity types
 */
export const LogEntities = {
  PRODUCT: "product",
  BLOG: "blog",
  CATEGORY: "category",
  BRAND: "brand",
  SHOWCASE: "showcase",
  PROVINCE: "province",
  PAGE: "page",
  MEDIA: "media",
  USER: "user",
  GLOBAL: "global",
  SETTING: "setting",
} as const;

/**
 * Quick log function for common operations
 */
export const quickLog = {
  createProduct: (id: number, name: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.PRODUCT,
      entityId: id,
      entityName: name,
      details: { type: "product" },
    }),
  updateProduct: (id: number, name: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.PRODUCT,
      entityId: id,
      entityName: name,
      details: { type: "product", changes },
    }),
  deleteProduct: (id: number, name: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.PRODUCT,
      entityId: id,
      entityName: name,
      details: { type: "product" },
    }),
  createBlog: (id: number, title: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.BLOG,
      entityId: id,
      entityName: title,
      details: { type: "blog" },
    }),
  updateBlog: (id: number, title: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.BLOG,
      entityId: id,
      entityName: title,
      details: { type: "blog", changes },
    }),
  deleteBlog: (id: number, title: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.BLOG,
      entityId: id,
      entityName: title,
      details: { type: "blog" },
    }),
  createCategory: (id: number, name: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.CATEGORY,
      entityId: id,
      entityName: name,
      details: { type: "category" },
    }),
  updateCategory: (id: number, name: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.CATEGORY,
      entityId: id,
      entityName: name,
      details: { type: "category", changes },
    }),
  deleteCategory: (id: number, name: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.CATEGORY,
      entityId: id,
      entityName: name,
      details: { type: "category" },
    }),
  createBrand: (id: number, name: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.BRAND,
      entityId: id,
      entityName: name,
      details: { type: "brand" },
    }),
  updateBrand: (id: number, name: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.BRAND,
      entityId: id,
      entityName: name,
      details: { type: "brand", changes },
    }),
  deleteBrand: (id: number, name: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.BRAND,
      entityId: id,
      entityName: name,
      details: { type: "brand" },
    }),
  createShowcase: (id: number, title: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.SHOWCASE,
      entityId: id,
      entityName: title,
      details: { type: "showcase" },
    }),
  updateShowcase: (id: number, title: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.SHOWCASE,
      entityId: id,
      entityName: title,
      details: { type: "showcase", changes },
    }),
  deleteShowcase: (id: number, title: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.SHOWCASE,
      entityId: id,
      entityName: title,
      details: { type: "showcase" },
    }),
  uploadMedia: (id: number, filename: string) =>
    logActivity({
      action: LogActions.UPLOAD,
      entity: LogEntities.MEDIA,
      entityId: id,
      entityName: filename,
      details: { type: "media" },
    }),
  deleteMedia: (id: number, filename: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.MEDIA,
      entityId: id,
      entityName: filename,
      details: { type: "media" },
    }),
  createUser: (id: number, email: string) =>
    logActivity({
      action: LogActions.CREATE,
      entity: LogEntities.USER,
      entityId: id,
      entityName: email,
      details: { type: "user" },
    }),
  updateUser: (id: number, email: string, changes: Record<string, any>) =>
    logActivity({
      action: LogActions.UPDATE,
      entity: LogEntities.USER,
      entityId: id,
      entityName: email,
      details: { type: "user", changes },
    }),
  deleteUser: (id: number, email: string) =>
    logActivity({
      action: LogActions.DELETE,
      entity: LogEntities.USER,
      entityId: id,
      entityName: email,
      details: { type: "user" },
    }),
  login: (userId: number, username: string) =>
    logActivity({
      action: LogActions.LOGIN,
      entity: LogEntities.USER,
      entityId: userId,
      entityName: username,
      details: { type: "auth", timestamp: new Date().toISOString() },
    }),
  logout: (userId: number, username: string) =>
    logActivity({
      action: LogActions.LOGOUT,
      entity: LogEntities.USER,
      entityId: userId,
      entityName: username,
      details: { type: "auth", timestamp: new Date().toISOString() },
    }),
};

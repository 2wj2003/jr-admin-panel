import { getApiUrl } from "../get-url";
import { imageFields } from "./const";
const qs = require("qs");

export interface BlogSerachQuery {
  category?: string;
  page?: string;
  pageSize?: number;
}

export const blogSerach = (params: BlogSerachQuery) => {
  const apiUrl = getApiUrl();

  const category = params.category
    ? [
        {
          category: {
            slug: {
              $eq: params.category,
            },
          },
        },
        {
          category: {
            parent: {
              slug: {
                $eq: params.category,
              },
            },
          },
        },
      ]
    : "";

  const filters = {
    $and: [],
  } as any;

  if (category) {
    filters.$and.push({ $or: category });
  }

  const query = qs.stringify(
    {
      sort: ["id"],
      fields: ["id", "title", "slug", "publishedAt", "description"],
      populate: {
        coverImage: {
          fields: imageFields,
        },
      },
      pagination: {
        pageSize: params.pageSize || 12,
        page: params.page || 1,
      },
      filters,
      publicationState: "live",
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/blogs?${query}`;
};

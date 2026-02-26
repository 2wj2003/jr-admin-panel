import { getApiUrl } from "../get-url";
import { imageFields } from "./const";
const qs = require("qs");

export interface ProductSerachQuery {
  category?: string;
  brands?: string;
  page?: string;
  ["min_price"]?: string;
  ["max_price"]?: string;
  pageSize?: number;
  resolutions?: string;
  keyword?: string;
}

export const productSerach = (params: ProductSerachQuery) => {
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

  if (params.keyword) {
    filters.$and.push({ name: { $contains: params.keyword } });
  }

  if (category) {
    filters.$and.push({ $or: category });
  }

  if (params.brands) {
    if (Array.isArray(params.brands)) {
      filters.$and.push({
        brands: {
          slug: {
            $in: params.brands,
          },
        },
      });
    } else {
      filters.$and.push({
        brands: {
          slug: {
            $eq: params.brands,
          },
        },
      });
    }
  }

  if (params.resolutions) {
    if (Array.isArray(params.resolutions)) {
      filters.$and.push({
        resolution: {
          $in: params.resolutions,
        },
      });
    } else {
      filters.$and.push({
        resolution: {
          $eq: params.resolutions,
        },
      });
    }
  }

  if (params.min_price) {
    filters.$and.push({
      originalPrice: {
        $gte: params.min_price,
      },
    });
  }

  if (params.max_price) {
    filters.$and.push({
      originalPrice: {
        $lte: params.max_price,
      },
    });
  }

  const query = qs.stringify(
    {
      sort: ["position"],
      fields: [
        "id",
        "name",
        "slug",
        "sku",
        "discountPrice",
        "originalPrice",
        "resolution",
      ],
      populate: {
        coverImage: {
          fields: imageFields,
        },
      },
      pagination: {
        pageSize: params.pageSize || 32,
        page: params.page || 1,
      },
      filters,
      publicationState: "live",
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/products?${query}`;
};

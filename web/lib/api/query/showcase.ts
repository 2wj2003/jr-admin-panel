import { getApiUrl } from "../get-url";
import { imageFields } from "./const";

const qs = require("qs");

interface Pagination {
  page: number;
  pageSize: number;
}

export const showcase = (
  filters: any,
  pagination: Pagination = { page: 1, pageSize: 20 }
) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters,
      pagination,
      fields: ["id", "title", "slug"],
      populate: {
        image: {
          fields: imageFields,
        },
        province: {
          populate: "*",
        },
        cover: {
          fields: imageFields,
        },
        images: {
          fields: imageFields,
        },
        seo: {
          populate: "*",
        },
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/showcases?${query}`;
};

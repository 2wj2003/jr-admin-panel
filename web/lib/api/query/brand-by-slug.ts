import { getApiUrl } from "../get-url";
import { blocks } from "./const";
const qs = require("qs");

export const brandBySlug = (slug: string) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        seo: true,
        logo: {
          populate: {
            url: true,
          },
        },
        products: {
          populate: {
            coverImage: "*",
          },
        },
        image: {
          populate: "*",
        },
      },
      pagination: {
        pageSize: 16,
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/brands?${query}`;
};

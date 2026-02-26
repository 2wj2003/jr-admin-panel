import { getApiUrl } from "../get-url";
const qs = require("qs");

export const brandByCategory = (slug?: string) => {
  const apiUrl = getApiUrl();

  const filters = slug
    ? {
        products: {
          $or: [
            {
              category: {
                slug: {
                  $eq: slug,
                },
              },
            },
            {
              category: {
                parent: {
                  slug: {
                    $eq: slug,
                  },
                },
              },
            },
            {
              category: {
                parent: {
                  parent: {
                    slug: {
                      $eq: slug,
                    },
                  },
                },
              },
            },
          ],
        },
      }
    : {};

  const query = qs.stringify(
    {
      filters,
      pagination: {
        pageSize: 100,
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/brands?${query}`;
};

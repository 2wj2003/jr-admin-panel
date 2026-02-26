import { getApiUrl } from "../get-url";
const qs = require("qs");

export const allCategories = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      populate: {
        parent: {
          fields: ["id", "slug"],
        },
        categories: {
          fields: ["id", "name", "slug"],
        },
      },
      fields: ["name", "slug"],
      pagination: {
        pageSize: 100,
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/categories?${query}`;
};

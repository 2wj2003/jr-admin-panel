import { getApiUrl } from "../get-url";
const qs = require("qs");

export const allProducts = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      pagination: {
        pageSize: 2000,
      },
      fields: ["id", , "slug"],
      publicationState: "live"
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/products?${query}`;
};

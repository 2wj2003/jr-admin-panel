import { blocks } from "./const";
import { getApiUrl } from "../get-url";

const qs = require("qs");

interface CategoryBySlug {
  slug?: string;
}
export const categoryBySlug = ({ slug }: CategoryBySlug) => {
  const apiUrl = getApiUrl();

  const filters = slug
    ? {
        slug: {
          $eq: slug,
        },
      }
    : {
        parent: {
          $null: true,
        },
      };

  const query = qs.stringify(
    {
      filters,
      populate: {
        blocks,
        seo: {
          populate: {
            metaImage: true,
          },
        },
        coverBanner: {
          populate: {
            image: true,
          },
        },
        parent: {
          populate: {
            categories: true,
          },
        },
        categories: true,
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/categories?${query}`;
};

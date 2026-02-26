import { getApiUrl } from "../get-url";
import { blocks, imageFields } from "./const";
const qs = require("qs");

export const homepage = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      populate: {
        blocks,
        heroCarousel: {
          populate: {
            image: {
              fields: imageFields,
            },
          },
        },
        seo: {
          populate: "*",
        },
        heroMenus: {
          populate: {
            image: {
              fields: imageFields,
            },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/homepage?${query}`;
};

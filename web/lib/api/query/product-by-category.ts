import { getApiUrl } from '../get-url';

const qs = require('qs');
export const productByCategoty = (slug: string) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        category: {
          slug: {
            $eq: slug
          }
        }
      },
      populate: '*'
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/products?${query}`;
};

import { getApiUrl } from '../get-url';
import { blocks } from './const';
const qs = require('qs');

export const pageBySlug = (slug: string) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: {
        blocks,
        seo: {
          populate: '*'
        }
      }
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/pages?${query}`;
};

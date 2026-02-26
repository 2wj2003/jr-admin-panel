import { getApiUrl } from '../get-url';
const qs = require('qs');

export const provinceBySlug = (slug: string) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug
        }
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/provinces?${query}`;
};

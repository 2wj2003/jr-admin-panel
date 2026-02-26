import { getApiUrl } from '../get-url';

const qs = require('qs');

export const productByIds = (ids: number[]) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        id: {
          $in: ids
        }
      },
      populate: '*',
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/products?${query}`;
};

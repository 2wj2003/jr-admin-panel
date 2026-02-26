import { getApiUrl } from '../get-url';
import { blocks, imageFields } from './const';
const qs = require('qs');

export const allBrands = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      populate: {
        logo: {
          fields: imageFields,
        }
      },
      pagination: {
        pageSize: 18
      }
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/brands?${query}`;
};

import { getApiUrl } from '../get-url';
const qs = require('qs');

export const allProvinces = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      pagination: {
        pageSize: 100
      },
      sort: ['name_th:asc']
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/provinces?${query}`;
};

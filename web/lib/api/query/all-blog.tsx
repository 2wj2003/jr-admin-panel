import { getApiUrl } from '../get-url';
const qs = require('qs');

export const allBlog = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      pagination: {
        page: 1,
        pageSize: 100
      }
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/blogs?${query}`;
};

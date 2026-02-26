import { getApiUrl } from '../get-url';

export const menuBySlug = (slug: string) => {
  const apiUrl = getApiUrl();

  return `${apiUrl}/api/menus/${slug}`;
};

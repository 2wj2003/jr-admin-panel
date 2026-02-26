import { getApiUrl } from '../get-url';

const qs = require('qs');

interface ShowcaseBySlug {
  slug: string;
  preview?: boolean;
}
export const showcaseBySlug = ({ slug, preview }: ShowcaseBySlug) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: '*',
      publicationState: preview ? 'preview' : 'live'
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/showcases?${query}`;
};

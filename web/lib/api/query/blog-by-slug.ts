import { getApiUrl } from '../get-url';

const qs = require('qs');

interface BlogBySlug {
  slug: string;
  preview?: boolean;
}
export const blogBySlug = ({ slug, preview }: BlogBySlug) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: {
        blocks: {
          populate: {
            products: {
              populate: {
                coverImage: '*'
              }
            }
          }
        },
        category: {
          populate: ['parent']
        },
        coverImage: {
          populate: '*'
        },
        seo: {
          populate: '*'
        }
      },
      publicationState: preview ? 'preview' : 'live'
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/blogs?${query}`;
};

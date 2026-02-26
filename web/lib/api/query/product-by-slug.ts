import { getApiUrl } from '../get-url';
import { imageFields } from './const';

const qs = require('qs');

interface ProductBySlug {
  slug: string;
  preview?: boolean;
}
export const productBySlug = ({ slug, preview }: ProductBySlug) => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: {
        medias: {
          fields: imageFields,
        },
        coverImage: {
          fields: imageFields,
        },
        files: {
          fields: imageFields,
        },
        brands: {
          fields: ['id', 'name', 'slug']
        },
        category: '*',
        seo: '*'
      },
      publicationState: preview ? 'preview' : 'live'
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/products?${query}`;
};

import { ProductEntity } from '../../../lib/@generated/graphql';
import { ProductCardProps } from '../product-card';

export const ProductToCard = (product: ProductEntity): ProductCardProps => {
  return {
    imageUrl: product.attributes?.coverImage?.data?.attributes?.url || '',
    name: product.attributes?.name || '',
    slug: product.attributes?.slug || '',
    originalPrice: product.attributes?.originalPrice || 0,
    discountPrice: product.attributes?.discountPrice || 0
  };
};

export default ProductToCard

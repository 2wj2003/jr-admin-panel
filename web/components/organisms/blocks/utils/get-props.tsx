import {
  BlogEntity,
  BlogRelationResponseCollection,
  ComponentSharedBanner,
  ComponentSharedTestimonial,
  Enum_Componentsharedcarousel_Type,
  Maybe,
  ProductEntity,
  ProductRelationResponseCollection,
  ShowcaseEntity,
  ShowcaseRelationResponseCollection
} from '@lib/@generated/graphql';
import { CardType } from './type';

interface Props {
  blogs?: Maybe<BlogRelationResponseCollection>;
  products?: Maybe<ProductRelationResponseCollection>;
  showcases?: Maybe<ShowcaseRelationResponseCollection>;
  testimonials?: Maybe<Array<Maybe<ComponentSharedTestimonial>>>;

  banners?: Maybe<Array<Maybe<ComponentSharedBanner>>>;
}

export const getProps = (
  type: CardType | undefined,
  props: Props
): Array<
  | ShowcaseEntity
  | ProductEntity
  | Maybe<ComponentSharedTestimonial>
  | Maybe<ComponentSharedBanner>
  | BlogEntity
> => {
  switch (type) {
    case Enum_Componentsharedcarousel_Type.Products:
      return props.products?.data || [];

    case Enum_Componentsharedcarousel_Type.Blogs:
      return props.blogs?.data || [];

    case Enum_Componentsharedcarousel_Type.Showcases:
      return props.showcases?.data || [];

    case Enum_Componentsharedcarousel_Type.Testimonials:
      return props.testimonials || [];

    case Enum_Componentsharedcarousel_Type.Banners:
      return props.banners || [];

    case Enum_Componentsharedcarousel_Type.Testimonials:
      return props.testimonials || [];
    default:
      return [];
  }
};

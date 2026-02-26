import BlogToCard from "@components/organisms/transformers/blog-to-card";
import ProductToCard from "@components/organisms/transformers/product-to-card";
import { CardType } from "./type";
export const getTransfromer = (type: CardType | undefined) => {
  switch (type) {
    case "products":
      return ProductToCard;

    case "blogs":
      return BlogToCard;

    case "banners":
      return (props: any) => props;

    case "testimonials":
      return (props: any) => props;

    case "showcases":
      return (props: any) => props;

    default:
      return (props: any) => props;
  }
};

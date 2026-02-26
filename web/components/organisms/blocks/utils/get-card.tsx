import dynamic from 'next/dynamic';
import { CardType } from './type';

export const getCard = (type: CardType | undefined) => {
  switch (type) {
    case 'products':
      return dynamic(() => import('@components/organisms/product-card'));

    case 'blogs':
      return dynamic(() => import('@components/organisms/blog-card'));

      case 'blogs':
        return dynamic(() => import('@components/organisms/blog-card'));

    case 'showcases':
      return dynamic(() => import('@components/organisms/showcase-card'));

      case 'testimonials':
        return dynamic(() => import('@components/molecules/testimonial-card'));
    default:
      break;
  }
};

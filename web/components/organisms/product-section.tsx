import { ProductEntity } from '@lib/@generated/graphql';
import ProductCard from './product-card';

interface ProductSectionProps {
  products: ProductEntity[];
  title: string;
  id: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  id,
  title
}) => {
  return (
    <section id={id} className="my-8">
      <div className="overflow-hidden container mx-auto px-2 md:px-8 lg:px-10">
        <h2 className="text-slate-900 font-medium text-xl md:text-2xl font-sans my-8">
          {title}
        </h2>
        <li className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ul className="col-span-1" key={product.id}>
              <ProductCard
                imageUrl={
                  product.attributes?.coverImage?.data?.attributes?.url || ''
                }
                name={product.attributes?.name || ''}
                slug={product.attributes?.slug || ''}
                originalPrice={product.attributes?.originalPrice || 0}
                discountPrice={product.attributes?.discountPrice || 0}
              />
            </ul>
          ))}
        </li>
      </div>
    </section>
  );
};

// import { ComponentSharedProductGrid } from '@lib/@generated/graphql';
import cx from 'classnames';
import { ProductCard } from '../product-card';

// export interface ProductGridProps extends ComponentSharedProductGrid {}

// export const ProductGrid: React.FC<ProductGridProps> = ({
//   title,
//   description,
//   products
// }) => {
//   return (
//     <section className="flex flex-col space-y-4">
//       {!!title && (
//         <div className="flex flex-row justify-between mt-4 md:mt-8">
//           <div className="flex flex-col md:px-0">
//             {title && (
//               <h2 className="text-slate-600 font-medium text-2xl my-auto font-sans mb-1">
//                 {title}
//               </h2>
//             )}
//             {description && (
//               <p className="text-base font-normal text-gray-secondary line-clamp-1">
//                 {description}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="overflow-hidden mt-2">
//         <div className="grid grid-cols-4">
//           {products?.data.map((product, idx) => (
            // <div className={cx('col-span-1')} key={idx}>
            //   <ProductCard
            //     imageUrl={
            //       product.attributes?.coverImage?.data?.attributes?.url || ''
            //     }
            //     name={product.attributes?.name || ''}
            //     slug={product.attributes?.slug || ''}
            //     originalPrice={product.attributes?.originalPrice || 0}
            //     discountPrice={product.attributes?.discountPrice || 0}
            //   />
            // </div>
//           ))}
//         </div>
//       </div>
//       <div className="py-4 text-center">
//         <button className="text-lg font-medium text-slate-600 px-8 py-2 min-w-64 border border-gray-300 rounded-full cursor-pointer hover:shadow-normal hover:border-primary-500 bg-white">
//           แสดงทั้งหมด
//         </button>
//       </div>
//     </section>
//   );
// };

// export default ProductGrid;

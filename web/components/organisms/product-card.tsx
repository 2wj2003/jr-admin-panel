import Image from "next/image";
import Link from "next/link";

interface ProductPriceProps {
  originalPrice: number;
  discountPrice?: number;
}
export interface ProductCardProps extends ProductPriceProps {
  imageUrl: string;
  name: string;
  slug: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  discountPrice,
  originalPrice,
}) => {
  const showPrice = originalPrice - (discountPrice || 0) !== 0;

  if (!showPrice) {
    return (
      <div className="flex">
        <p className="text-slate-600 text-base font-medium">โปรดสอบถามราคา</p>
      </div>
    );
  }

  if (!discountPrice) {
    return (
      <div className="flex">
        <p className="text-slate-900 text-lg font-medium">
          {new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
            maximumFractionDigits: 0,
          }).format(originalPrice)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row space-x-2 flex-wrap">
      <div className="rounded px-1 bg-red-600 text-white inline-block text-sm font-medium my-auto">
        {new Intl.NumberFormat("th-TH", {
          style: "percent",
          maximumFractionDigits: 0,
        }).format(discountPrice / originalPrice)}
      </div>
      <p className="text-slate-900 text-lg font-medium">
        {new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        }).format(originalPrice - discountPrice)}
      </p>
      <p className="text-slate-900 text-sm font-normal opacity-50 line-through my-auto">
        {new Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        }).format(originalPrice)}
      </p>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  name,
  slug,
  discountPrice,
  originalPrice,
}) => (
  <Link href={`/products/${slug}`} id={slug}>
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative">
        <Image
          src={imageUrl}
          loading="lazy"
          width="480"
          height="480"
          className="bg-gray-100"
          alt={name}
          title={name}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
      <div className="flex flex-col space-y-2 px-2 md:px-4 py-4">
        <div className="text-sm text-gray-secondary font-normal min-h-[2.5rem]">
          <span className="line-clamp-2 ">{name}</span>
        </div>
        <ProductPrice
          originalPrice={originalPrice}
          discountPrice={discountPrice}
        />
      </div>
    </div>
  </Link>
);

export default ProductCard;

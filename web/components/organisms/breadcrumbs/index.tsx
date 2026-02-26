import { Category, Maybe } from '@lib/@generated/graphql';
import Link from 'next/link';

interface BreadcrumbProps {
  name: string;
  slug: string;

  type: 'blogs' | 'products' | 'showcases';

  category?: Maybe<Category>;

  parent?: Maybe<Category>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  name,
  slug,
  type,
  category,
  parent
}) => {
  return (
    <div className="flex w-full breadcrumb text-sm font-normal overflow-x-scroll no-scrollbar my-4">
      <Link href={`/${type}`} className="breadcrumb-item text-gray-500">

        {type === 'blogs' && 'บทความ'}
        {type === 'products' && 'สินค้า'}
        {type === 'showcases' && 'ผลงานติดตั้ง'}

      </Link>
      {!!parent && (
        <Link
          href={`/${type}/category/${parent?.slug}`}
          className="breadcrumb-item text-gray-500">
          {parent?.name}
        </Link>
      )}
      {!!category && (
        <Link
          href={`/${type}/category/${category?.slug}`}
          className="breadcrumb-item text-gray-500">
          {category?.name}
        </Link>
      )}
      <Link
        href={`/${type}/${slug}`}
        className="breadcrumb-item text-slate-600">
        {name}
      </Link>
    </div>
  );
};

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import cx from "classnames";
import { BrandEntity } from "@lib/@generated/graphql";

const isActive = (slug?: string, brands?: string | string[] | null) => {
  if (!slug) {
    return false;
  }

  if (Array.isArray(brands)) {
    const exist = brands?.find((b) => b === slug);

    return !!exist;
  }

  if (brands === slug) {
    return true;
  }

  return false;
};

const buildBrandQuery = (slug?: string, brands?: string | string[] | null) => {
  if (!brands && !slug) {
    return [];
  }

  if (!brands && slug) {
    return [slug];
  }

  if (!slug) {
    return brands;
  }

  if (Array.isArray(brands)) {
    const exist = brands?.find((b) => b === slug);

    if (exist) {
      return brands?.filter((b) => b !== slug);
    }

    return [...brands, slug];
  }

  if (brands) {
    return [brands, slug];
  }

  return [];
};

interface Props {
  brands: BrandEntity[];
}

export const BrandFilter: React.FC<Props> = ({ brands }) => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  return (
    <div className="text-gray-secondary">
      <div className="text-primary font-semibold text-lg mb-2">แบรนด์</div>
      <ul className="flex flex-col gap-2 text-sm">
        {brands.map((b) => {
          const q = {
            page: 1,
            brands: buildBrandQuery(
              b.attributes?.slug,
              searchParams?.getAll("brands")
            ),
          };

          const at = isActive(
            b.attributes?.slug,
            searchParams?.getAll("brands")
          );

          return (
            <li key={b.id} className="text-slate-700 hover:text-primary-500">
              <Link
                href={{
                  pathname,
                  query: q,
                }}
              >
                <input
                  type="checkbox"
                  value=""
                  defaultChecked={at}
                  checked={at}
                  className={cx(
                    "w-5 h-5 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                  )}
                />
                {b.attributes?.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

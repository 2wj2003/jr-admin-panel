"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import cx from "classnames";
import { BrandEntity, Enum_Product_Resolution } from "@lib/@generated/graphql";

const isActive = (slug?: string, resolutions?: string | string[] | null) => {
  if (!slug) {
    return false;
  }

  if (Array.isArray(resolutions)) {
    const exist = resolutions?.find((b) => b === slug);

    return !!exist;
  }

  if (resolutions === slug) {
    return true;
  }

  return false;
};

const buildBrandQuery = (slug?: string, resolutions?: string | string[] | null) => {
  if (!resolutions && !slug) {
    return [];
  }

  if (!resolutions && slug) {
    return [slug];
  }

  if (!slug) {
    return resolutions;
  }

  if (Array.isArray(resolutions)) {
    const exist = resolutions?.find((b) => b === slug);

    if (exist) {
      return resolutions?.filter((b) => b !== slug);
    }

    return [...resolutions, slug];
  }

  if (resolutions) {
    return [resolutions, slug];
  }

  return [];
};

interface Props {}

const resolutionEnum = [
  {
    key: "cctv-2mp",
    title: "2 ล้านพิกเซล",
  },
  {
    key: "cctv-3mp",
    title: "3 ล้านพิกเซล",
  },
  {
    key: "cctv-4mp",
    title: "4 ล้านพิกเซล",
  },
  {
    key: "cctv-5mp",
    title: "5 ล้านพิกเซล",
  },
  {
    key: "cctv-8mp",
    title: "8 ล้านพิกเซล",
  },
];

export const ResolutionFilter: React.FC<Props> = ({}) => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  return (
    <div className="text-gray-secondary">
      <div className="text-primary font-semibold text-lg mb-2">ความคมชัด</div>
      <ul className="flex flex-col gap-2 text-sm">
        {resolutionEnum.map((r) => {
          const q = {
            page: 1,
            resolutions: buildBrandQuery(r.key, searchParams?.getAll("resolutions")),
          };

          const at = isActive(r.key, searchParams?.getAll("resolutions"));

          return (
            <li key={r.key} className="text-slate-700 hover:text-primary-500">
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
                {r.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

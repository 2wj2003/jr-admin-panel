"use client";

import { useSearchParams } from "next/navigation";
// import { usePathname } from "next/navigation";

interface Props {
  slug: string;
}

export const ClearFilter: React.FC<Props> = ({ slug }) => {
  const searchParams = useSearchParams();

  const shouldShow =
    slug ||
    searchParams?.get("brands") ||
    searchParams?.get("min_price") ||
    searchParams?.get("max_price");

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="pt-3 border-t border-gray-200 w-full">
      <a
        className="bg-primary text-white rounded-lg text-base w-full p-2 text-center flex justify-center"
        href={`categories/${slug}`}
      >
        CLEAR
      </a>
    </div>
  );
};

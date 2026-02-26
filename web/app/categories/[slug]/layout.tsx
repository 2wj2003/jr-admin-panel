import { BlockManager } from "@components/organisms/blocks";
import {
  BrandEntityResponseCollection,
  CategoryEntity,
  CategoryEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allCategories } from "@lib/api/query/all-categories";
import { brandByCategory } from "@lib/api/query/brand-by-category";
import { categoryBySlug } from "@lib/api/query/category-by-slug";
import { transformToHierarchy } from "@lib/transformer/category-hierarchy";
import Link from "next/link";
import { BrandFilter } from "@components/search/brand-filter";
import { PriceFilter } from "@components/search/price-fillter";
import { ClearFilter } from "@components/search/clear-filter";
import { Slogan } from "@components/organisms/slogan";
import { Suspense } from "react";
import Image from "next/image";
import { ResolutionFilter } from "@components/search/resolution-filter";

export async function generateStaticParams() {
  const categoiesKey = allCategories();

  const [categories] = await Promise.all([
    fetcher<CategoryEntityResponseCollection>(categoiesKey).then((c) =>
      transformToHierarchy(c?.data || [])
    ).catch(() => []),
  ]);

  return (categories || []).map((c) => ({ slug: c.attributes?.slug }));
}

const getCategories = async (slug?: string) => {
  const categoryBySlugKey = categoryBySlug({ slug });
  const brandKey = brandByCategory(slug);

  const [category, brands] = await Promise.all([
    fetcher<CategoryEntityResponseCollection>(categoryBySlugKey).then(
      (c) => c?.data?.[0]
    ).catch(() => null),
    fetcher<BrandEntityResponseCollection>(brandKey).then((c) => c?.data || []).catch(() => []),
  ]);

  if (!category) return { categories: [], category: { attributes: {} } as any, brands: [] };

  let categories: CategoryEntity[] = [];

  if (category.attributes?.parent?.data) {
    categories =
      category.attributes.parent?.data.attributes?.categories?.data || [];
  } else {
    if (category.attributes?.categories?.data) {
      categories = category.attributes?.categories.data;
    }
  }

  return { categories, category, brands };
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { categories, category, brands } = await getCategories(params.slug);

  const shouldShowResolution =
    category.attributes?.slug === "cctv" ||
    category.attributes?.parent?.data?.attributes?.slug === "cctv";

  return (
    <section className="block w-full">
      <div className="container mx-auto py-2 px-4 md:px-8 lg:px-12">
        <div className="flex w-full breadcrumb text-sm font-normal overflow-x-scroll no-scrollbar mt-4 mb-8 border-b border-gray-200 pb-6">
          <Link href="/" className="breadcrumb-item text-gray-500">
            HOME
          </Link>
          {!!category.attributes?.parent?.data && (
            <Link
              href={
                "/categories/" +
                category.attributes?.parent?.data?.attributes?.slug
              }
              className="breadcrumb-item text-gray-500 uppercase"
              key={category.attributes?.parent?.data?.attributes?.slug}
              title={category.attributes?.parent?.data?.attributes?.name}
            >
              {category.attributes?.parent?.data?.attributes?.name}
            </Link>
          )}
          <Link
            href={"/categories/" + category.attributes?.slug}
            className="breadcrumb-item text-gray-500 uppercase"
            key={category.attributes?.slug}
            title={category.attributes?.name}
          >
            {category.attributes?.name}
          </Link>
        </div>
        <div className="float-left w-[250px] hidden md:flex md:flex-col pr-4 gap-4">
          {!!categories?.length && (
            <div className="text-gray-secondary">
              <div className="text-primary-500 font-semibold text-lg mb-2">
                หมวดหมู่สินค้า
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="text-slate-700 hover:text-primary-500"
                  >
                    <Link
                      href={"/categories/" + c.attributes?.slug}
                      className="flex flex-row"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                      />
                      {c.attributes?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!!(brands || []).length && (
            <Suspense>
              <BrandFilter brands={brands} />
            </Suspense>
          )}
          {!!shouldShowResolution && (
            <Suspense>
              <ResolutionFilter />
            </Suspense>
          )}
          <Suspense>
            <PriceFilter />{" "}
          </Suspense>
          <Suspense>
            <ClearFilter slug={params.slug} />
          </Suspense>
        </div>
        <main className="ml-0 md:ml-[240px] mb-16">
          {!!category?.attributes?.coverBanner && (
            <div>
              <Image
                src={
                  category?.attributes?.coverBanner?.image.data?.attributes
                    ?.url || ""
                }
                loading="lazy"
                width="2100"
                height="450"
                className="bg-gray-100 aspect-[42/9]"
                alt={
                  category?.attributes?.coverBanner?.image.data?.attributes
                    ?.name || ""
                }
                title={
                  category?.attributes?.coverBanner?.image.data?.attributes
                    ?.alternativeText || ""
                }
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          )}
          <h1 className="text-slate-900 text-2xl mb-6 font-semibold">
            {category?.attributes?.seo?.metaTitle || category?.attributes?.name}
          </h1>
          {children}
          <div className="mt-8" />
          <BlockManager
            blocks={category?.attributes?.blocks || []}
            isBlog={true}
            isCategory={true}
          />
        </main>
      </div>
      <Slogan />
    </section>
  );
}

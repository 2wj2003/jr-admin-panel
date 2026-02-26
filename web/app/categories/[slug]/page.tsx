import {
  ProductSerachQuery,
  productSerach,
} from "@lib/api/query/search-product";
import { fetcher } from "@lib/api/fetcher";
import {
  CategoryEntityResponseCollection,
  ProductEntityResponseCollection,
} from "@lib/@generated/graphql";
import ProductCard from "@components/organisms/product-card";
import { Pagination } from "@components/search/pagination";
import {
  transformToHierarchy,
} from "@lib/transformer/category-hierarchy";
import { allCategories } from "@lib/api/query/all-categories";
import { Metadata } from "next";
import { Article, BreadcrumbList, WebSite, WithContext } from "schema-dts";
import { categoryBySlug } from "@lib/api/query/category-by-slug";
import { Suspense } from "react";

export async function generateStaticParams() {
  const categoiesKey = allCategories();

  const [categories] = await Promise.all([
    fetcher<CategoryEntityResponseCollection>(categoiesKey).then((c) =>
      transformToHierarchy(c.data)
    ),
  ]);

  return categories.map((c) => ({ slug: c.attributes?.slug }));
}

const getServerSideProps = async ({
  params,
  query,
}: {
  params: { slug: string };
  query: ProductSerachQuery;
}) => {
  const productKey = productSerach({
    keyword: query.keyword,
    category: params.slug,
    brands: query?.brands as string,
    page: (query?.page as string) || "1",
    max_price: query.max_price,
    min_price: query.min_price,
    resolutions: query?.resolutions as string,
  });

  const categoryBySlugKey = categoryBySlug({ slug: params.slug });

  const [products, category] = await Promise.all([
    fetcher<ProductEntityResponseCollection>(productKey),
    fetcher<CategoryEntityResponseCollection>(categoryBySlugKey).then(
      (c) => c.data[0]
    ),
  ]);

  return {
    products: products.data || [],
    meta: products.meta,
    category,
  };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function SerachPage({
  params,
  searchParams = {},
}: {
  params: { slug: string };
  searchParams?: ProductSerachQuery;
}) {
  const { products, meta, category } = await getServerSideProps({
    params,
    query: searchParams,
  });

  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: category.attributes?.parent?.data
      ? [
          {
            "@type": "ListItem",
            position: 0,
            name: "หน้าหลัก",
            item: "https://www.jr.co.th",
          },
          {
            "@type": "ListItem",
            position: 1,
            name: category?.attributes?.parent?.data?.attributes?.name,
            item:
              "https://www.jr.co.th/categories/" +
              category?.attributes?.parent?.data?.attributes?.slug,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category?.attributes?.name,
            item:
              "https://www.jr.co.th/categories/" + category?.attributes?.slug,
          },
        ]
      : [
          {
            "@type": "ListItem",
            position: 0,
            name: "หน้าหลัก",
            item: "https://www.jr.co.th",
          },
          {
            "@type": "ListItem",
            position: 1,
            name: category?.attributes?.name,
            item:
              "https://www.jr.co.th/categories/" + category?.attributes?.slug,
          },
        ],
  };
  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      category?.attributes?.seo?.metaTitle || category?.attributes?.name,
    description: category?.attributes?.seo?.metaDescription || "",
    datePublished: category?.attributes?.createdAt,
    dateModified: category?.attributes?.updatedAt,
  };

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    headline:
      category?.attributes?.seo?.metaTitle || category?.attributes?.name,
    description: category?.attributes?.seo?.metaDescription || "",
    datePublished: category?.attributes?.createdAt,
    dateModified: category?.attributes?.updatedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <div className="grid grid-cols-12 gap-2">
        {products.map((p) => (
          <div className="col-span-6 md:col-span-3" key={p.id}>
            <ProductCard
              imageUrl={p.attributes?.coverImage?.data?.attributes?.url || ""}
              name={p.attributes?.name || ""}
              slug={p.attributes?.slug || ""}
              originalPrice={p.attributes?.originalPrice || 0}
              discountPrice={p.attributes?.discountPrice || 0}
            />
          </div>
        ))}
      </div>
      <Suspense>
        <Pagination
          totalPages={meta?.pagination.pageCount}
          currentPage={meta?.pagination.page}
          pageRange={5}
        />
      </Suspense>
    </>
  );
}

const getData = async (slug: string) => {
  const categoryBySlugKey = categoryBySlug({ slug });

  const [category] = await Promise.all([
    fetcher<CategoryEntityResponseCollection>(categoryBySlugKey).then(
      (c) => c.data[0]
    ),
  ]);

  return { category };
};

export async function generateMetadata({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { page?: string };
}): Promise<Metadata | null> {
  const { category } = await getData(params.slug);

  if (!category) {
    return null;
  }

  const seoImage = category?.attributes?.seo?.metaImage?.data?.attributes;

  return {
    title: category?.attributes?.seo?.metaTitle || category?.attributes?.name,
    description: category?.attributes?.seo?.metaDescription || "",
    alternates: {
      canonical: `https://www.jr.co.th/categories/${category?.attributes?.slug}`,
    },
    openGraph: {
      url: `https://www.jr.co.th/categories/${category?.attributes?.slug}`,
      title: category?.attributes?.seo?.metaTitle || category?.attributes?.name,
      description: category?.attributes?.seo?.metaDescription || "",
      images: [
        {
          url: seoImage?.url || "",
          width: seoImage?.width || 300,
          height: seoImage?.height || 300,
          alt: seoImage?.alternativeText || "",
          type: seoImage?.mime,
        },
      ],
      type: "article",
      siteName: "jr.co.th",
      publishedTime: category?.attributes?.createdAt,
      modifiedTime: category?.attributes?.updatedAt,
    },
    keywords: category.attributes?.seo?.keywords,
    robots: {
      follow: true,
      index: true,
    },
  };
}
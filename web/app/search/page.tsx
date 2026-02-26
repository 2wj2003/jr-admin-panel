import { ProductEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { Suspense } from "react";
import {
  ProductSerachQuery,
  productSerach,
} from "@lib/api/query/search-product";
import ProductCard from "@components/organisms/product-card";
import { Pagination } from "@components/search/pagination";

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
  });

  const [products] = await Promise.all([
    fetcher<ProductEntityResponseCollection>(productKey),
  ]);

  return { products: products.data || [], meta: products.meta };
};

export default async function Page({
  params,
  searchParams = {},
}: {
  params: { slug: string };
  searchParams?: ProductSerachQuery;
}) {
  const { products, meta } = await getServerSideProps({
    params,
    query: searchParams,
  });

  return (
    <>
      <h1 className="text-slate-900 text-xl mb-6 font-semibold">
        ผลลัพธ์การค้นหา สำหรับ
        <span className="text-primary ml-2">
          &quot;{searchParams.keyword}&quot;
        </span>
      </h1>
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

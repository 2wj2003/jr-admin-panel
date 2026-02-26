import { BlogEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { Suspense } from "react";
import ProductCard from "@components/organisms/product-card";
import { Pagination } from "@components/search/pagination";
import { blogSerach, BlogSerachQuery } from "@lib/api/query/search-blogs";
import BlogCard from "@components/organisms/blog-card";

const getServerSideProps = async ({
  params,
  query,
}: {
  params: { slug: string };
  query: BlogSerachQuery;
}) => {
  const productKey = blogSerach({
    category: params.slug,
    page: (query?.page as string) || "1",
  });

  console.log(productKey);

  const { data, meta } = await fetcher<BlogEntityResponseCollection>(
    productKey
  );

  return { blogs: data || [], meta };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({
  params,
  searchParams = {},
}: {
  params: { slug: string };
  searchParams?: BlogSerachQuery;
}) {
  const { blogs, meta } = await getServerSideProps({
    params,
    query: searchParams,
  });

  return (
    <div className="container mx-auto py-2 sm:py-12 px-4 md:px-8 lg:px-12">
      <h1 className="text-slate-900 text-xl mb-6 font-semibold">
        บทความ
        {/* <span className="text-primary ml-2">
          &quot;{searchParams.keyword}&quot;
        </span> */}
      </h1>
      <div className="grid grid-cols-12 gap-2">
        {blogs.map((p) => (
          <div className="col-span-6 sm:col-span-4" key={p.id}>
            <BlogCard
              slug={p.attributes?.slug || ""}
              title={p.attributes?.title || ""}
              imageUrl={p.attributes?.coverImage?.data?.attributes?.url || ""}
              description={p.attributes?.description || ""}
              publishedAt={p.attributes?.publishedAt || ""}
              ImageAlternativeText={
                p.attributes?.coverImage?.data?.attributes?.alternativeText ||
                ""
              }
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
    </div>
  );
}

export const generateMetadata = () => {
  const metadata = {
    title: `บทความ | เจ.อาร์ ออฟฟิต ออโตเมชั่น`,
    description: "บริการติดตั้งและจัดจำหน่าย ระบบกล้องวงจรปิด CCTV ประตูรีโมท และโซล่าเซลล์ ทั่วประเทศ การันตีคุณภาพกว่า 35 ปี",
    keywords: ["blog", "articles", "latest"],
  };

  return metadata;
};

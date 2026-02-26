import { BlockManager } from "@components/organisms/blocks";
import {
  BlogEntityResponseCollection,
  PageEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { blogBySlug } from "@lib/api/query/blog-by-slug";
import { Breadcrumb } from "@components/organisms/breadcrumbs";
import Image from "next/image";
import { allBlog } from "@lib/api/query/all-blog";
import { Metadata } from "next";
import striptags from "striptags";
import { draftMode } from "next/headers";

const generateMetaDescription = (text: string) => {
  const strippedText = striptags(text);
  const description = strippedText.substring(0, 150);
  return description;
};

export async function generateStaticParams() {
  const key = allBlog();

  const res = await fetcher<PageEntityResponseCollection>(key);

  const paths = res.data.map((d) => {
    return {
      slug: d.attributes?.slug,
    };
  });

  return paths;
}

const getPage = async (slug: string, preview?: boolean) => {
  const key = blogBySlug({ slug: decodeURIComponent(slug), preview });

  const res = await fetcher<BlogEntityResponseCollection>(key);

  return res?.data?.[0];
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const { isEnabled } = draftMode();

  const blog = await getPage(params.slug, isEnabled);

  const category = blog.attributes?.category?.data;

  return (
    <div className="container mx-auto md:py-4 px-4 md:px-8 lg:px-16">
      <Breadcrumb
        name={blog.attributes?.title || ""}
        slug={blog.attributes?.slug || ""}
        category={category?.attributes}
        parent={category?.attributes?.parent?.data?.attributes}
        type="blogs"
      />
      <div className="grid grid-cols-12">
        <div className="col-span-12  md:col-span-8 md:col-start-3">
          {!!blog.attributes?.coverImage?.data?.attributes?.url && (
            <Image
              src={blog.attributes?.coverImage?.data.attributes?.url}
              width={1200}
              height={630}
              loading="eager"
              //   layout="responsive"
              //   objectFit="cover"
              className="overflow-hidden rounded-lg"
              alt={
                blog.attributes?.coverImage?.data.attributes?.alternativeText ||
                ""
              }
            />
          )}
          <h1 className="text-slate-800 font-medium text-4xl my-8">
            {blog?.attributes?.title}
          </h1>
          <BlockManager blocks={blog?.attributes?.blocks || []} isBlog />
        </div>
      </div>
    </div>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getPage(params.slug);

  const seoDescription =
    data?.attributes?.seo?.metaDescription ||
    generateMetaDescription(data?.attributes?.description || "");

  return {
    title: data?.attributes?.seo?.metaTitle || data?.attributes?.title,
    description: data?.attributes?.seo?.metaDescription,
    openGraph: {
      type: "article",
      url: "https://www.jr.co.th/blogs/" + params.slug,
      siteName: "jr.co.th",
      title: data?.attributes?.seo?.metaTitle || data?.attributes?.title,
      description: seoDescription,
    },
    alternates: {
      canonical: "https://www.jr.co.th/blogs/" + params.slug,
    },
    robots: {
      follow: true,
      index: true,
    },
  };
}

export const revalidate = 60;

export default Page;

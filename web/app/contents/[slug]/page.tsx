import { Navbar } from "@components/molecules/navbar";
import { BlockManager } from "@components/organisms/blocks";
import { FooterCategoies } from "@components/organisms/categoies-footer";
import { Footer } from "@components/organisms/footer";
import {
  PageEntity,
  PageEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allPage } from "@lib/api/query/all-page";
import { pageBySlug } from "@lib/api/query/page-by-slug";
import { aboutMenus } from "@lib/consts/menu-links/about";
import { serviceMenus } from "@lib/consts/menu-links/service";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
  const key = allPage();

  const res = await fetcher<PageEntityResponseCollection>(key).catch(() => ({ data: [] }));

  const paths = (res?.data || []).map((d) => {
    return {
      slug: d.attributes?.slug,
    };
  });

  return paths;
}

const getPage = async (slug: string) => {
  const key = pageBySlug(encodeURIComponent(slug));

  const res = await fetcher<PageEntityResponseCollection>(key);

  return res?.data?.[0];
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const data = await getPage(params.slug);

  return (
    <div className="overflow-hidden container mx-auto px-0 md:px-8 lg:px-10 mt-4 md:mt-8">
      <div className="flex flex-row">
        <div className="w-[400px] border-r border-gray-200 hidden md:inline-block">
          <ul className="flex flex-col divide-y">
            {aboutMenus.map((m) => (
              <Link href={m.slug} key={m.slug}>
                <li className="bg-white hover:bg-primary-100 text-slate-600 hover:text-primary text-lg font-medium pl-2 py-4">
                  {m.title}
                </li>
              </Link>
            ))}
            {serviceMenus.map((m) => (
              <Link href={m.slug} key={m.slug}>
                <li className="bg-white hover:bg-primary-100 text-slate-600 hover:text-primary text-lg font-medium pl-2 py-4">
                  {m.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="px-4 md:px-0">
          <BlockManager blocks={data?.attributes?.blocks || []} />
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

  return {
    title: data?.attributes?.seo?.metaTitle || data?.attributes?.title,
    description: data?.attributes?.seo?.metaDescription,
    openGraph: {
      type: "article",
      url: "https://www.jr.co.th/contents/" + params.slug,
      siteName: "jr.co.th",
      title: data?.attributes?.seo?.metaTitle || data?.attributes?.title,
      description: data?.attributes?.seo?.metaDescription,
    },
    alternates: {
      canonical: "https://www.jr.co.th/contents/" + params.slug,
    },
    robots: {
      follow: true,
      index: true,
    },
  };
}

export const revalidate = 60;

export default Page;

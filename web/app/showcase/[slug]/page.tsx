import Image from "next/image";
import { Navbar } from "@components/molecules/navbar";
import RichText from "@components/molecules/rich-text";
// import { Breadcrumb } from "@components/organisms/breadcrumbs";
import { FooterCategoies } from "@components/organisms/categoies-footer";
import { Footer } from "@components/organisms/footer";
import {
  ShowcaseEntity,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { showcaseBySlug } from "@lib/api/query/showcase-by-slug";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { getApiUrl } from "@lib/api/get-url";
const qs = require('qs');

interface ShowcaseProps {
  slug: string;
  preview?: boolean;

  showcase: ShowcaseEntity;
}

export async function generateStaticParams() {
  const apiUrl = getApiUrl();
  
  const query = qs.stringify(
    {
      pagination: {
        pageSize: 1000
      }
    },
    { encodeValuesOnly: true }
  );

  const key = `${apiUrl}/api/showcases?${query}`;

  const res = await fetcher<ShowcaseEntityResponseCollection>(key);

  const paths = res.data.map((d) => {
    return {
      slug: d.attributes?.slug
    };
  });

  return paths.filter((p) => p.slug?.length && p.slug?.length < 60);
}

const getData = async (slug: string) => {
  const showcaseKey = showcaseBySlug({
    slug: decodeURIComponent(slug),
    // preview,
  });

  const res = await fetcher<ShowcaseEntityResponseCollection>(showcaseKey);

  const showcase = res.data[0];

  return showcase;
};

const Showcase = async ({ params }: { params: { slug: string } }) => {
  const showcase = await getData(params.slug);

  return (
    <div>
      <div className="overflow-hidden container mx-auto px-2 md:px-8 lg:px-10 my-4">
        <div className="flex w-full breadcrumb text-sm font-normal overflow-x-scroll no-scrollbar my-4">
          <Link href="/showcases" className="breadcrumb-item text-gray-500">
            ผลงานติดตั้ง
          </Link>

          <Link
            href={`/showcases/${params.slug}`}
            className="breadcrumb-item text-slate-600"
          >
            {showcase?.attributes?.title}
          </Link>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-12  md:col-span-8 md:col-start-3">
            {!!showcase?.attributes?.cover?.data?.attributes?.url && (
              <div className="my-4">
                <Image
                  src={showcase?.attributes?.cover?.data.attributes?.url}
                  width={1080}
                  height={720}
                  loading="eager"
                  // layout="responsive"
                  // objectFit="cover"
                  style={{ objectFit: "cover" }}
                  className="overflow-hidden rounded-lg aspect-[1080/720]"
                  alt={
                    showcase?.attributes?.cover?.data.attributes
                      ?.alternativeText || ""
                  }
                />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {showcase?.attributes?.images?.data.map((i) => (
                <div className="relative" key={i.id}>
                  <Image
                    src={i.attributes?.url || ""}
                    width={300}
                    height={300}
                    // layout="responsive"
                    loading="lazy"
                    // objectFit="cover"
                    // placeholder="blur"
                    style={{ objectFit: "cover" }}
                    alt={i.attributes?.alternativeText || ""}
                    className="overflow-hidden rounded-lg aspect-square"
                  />
                </div>
              ))}
            </div>
            <h2 className="text-slate-600 font-medium text-xl md:text-2xl font-sans my-8">
              {showcase?.attributes?.title}
            </h2>
            <div className="my-8">
              <RichText
                markup={showcase?.attributes?.description || ""}
                className="prose prose-base lg:prose-lg font-body"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const revalidate = 60;

export default Showcase;

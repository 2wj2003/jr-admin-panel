import Image from "next/image";
import { BlockManager } from "@components/organisms/blocks";
import HeroCategory from "@components/organisms/hero-category";
import {
  BrandEntityResponseCollection,
  Homepage,
  HomepageEntityResponse,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allBrands } from "@lib/api/query/all-brands";
import { homepage } from "@lib/api/query/homepage";
import Link from "next/link";
import { Slogan } from "@components/organisms/slogan";
import { Metadata } from "next";

const getData = async () => {
  const pageKey = homepage();
  const brandKey = allBrands();
  // const categoriesKey = allCategories();

  const [page, brands] = await Promise.all([
    fetcher<HomepageEntityResponse>(pageKey).then((r) => r.data),
    fetcher<BrandEntityResponseCollection>(brandKey),
    // fetcher<CategoryEntityResponseCollection>(categoriesKey)
  ]);

  return { page, brands: brands.data };
};

export const revalidate = 60;

export default async function HomePage() {
  const { page, brands } = await getData();

  return (
    <div className="py-0 md:py-2">
      <section className="container mx-auto px-0 md:px-8 lg:px-10 my-0 md:my-4">
        <HeroCategory
          banners={page?.attributes?.heroCarousel || []}
          menus={page?.attributes?.heroMenus || []}
        />
      </section>
      <BlockManager blocks={page?.attributes?.blocks || []} />
      <div className="overflow-hidden container mx-auto px-2 md:px-8 lg:px-10 mt-8 mb-16">
        <h2 className="text-slate-900 font-medium text-xl md:text-2xl my-auto font-sans mb-4">
          ช้อปตามแบรนด์ดัง
        </h2>
        <ul className="grid grid-cols-4 md:grid-cols-6 gap-6 sm:gap-4 place-items-center items-center justify-center">
          {brands?.map((b) => (
            <li key={b.id} className="relative col-span-1 aspect-[5/2] w-full">
              <Link href={`/brands/${b.attributes?.slug}`}>
                <Image
                  src={b.attributes?.logo?.data?.attributes?.url || ""}
                  // width={300}
                  // height={300}
                  // layout="responsive"
                  // objectFit="contain"
                  // objectPosition="center"
                  loading="lazy"
                  // placeholder="blur"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                  }}
                  alt={
                    b.attributes?.logo?.data?.attributes?.alternativeText || ""
                  }
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Slogan />
    </div>
  );
}

export const metadata: Metadata = {
  title: "เจ.อาร์ ออฟฟิต ออโตเมชั่น",
  description:
    "บริการติดตั้งและจัดจำหน่าย ระบบกล้องวงจรปิด CCTV ประตูรีโมท และโซล่าเซลล์ ทั่วประเทศ การันตีคุณภาพกว่า 35 ปี",
  openGraph: {
    type: "article",
    url: "https://www.jr.co.th",
    siteName: "jr.co.th",
    title: "เจ.อาร์ ออฟฟิต ออโตเมชั่น",
    description:
      "บริการติดตั้งและจัดจำหน่าย ระบบกล้องวงจรปิด CCTV ประตูรีโมท และโซล่าเซลล์ ทั่วประเทศ การันตีคุณภาพกว่า 35 ปี",
  },
  alternates: {
    canonical: "https://www.jr.co.th",
  },
  robots: {
    follow: true,
    index: true,
  },
};
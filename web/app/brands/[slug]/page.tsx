import ProductCard from "@components/organisms/product-card";
import { BrandEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { brandBySlug } from "@lib/api/query/brand-by-slug";
import Link from "next/link";
import { getApiUrl } from "@lib/api/get-url";
import { Metadata } from "next";
import RichText from "@components/molecules/rich-text";

const qs = require("qs");

const dfDescription =
  "บริการติดตั้งและจัดจำหน่าย ระบบกล้องวงจรปิด CCTV ประตูรีโมท และโซล่าเซลล์ ทั่วประเทศ การันตีคุณภาพกว่า 35 ปี";

export async function generateStaticParams() {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      pagination: {
        pageSize: 100,
      },
    },
    { encodeValuesOnly: true }
  );

  const key = `${apiUrl}/api/brands?${query}`;

  const res = await fetcher<BrandEntityResponseCollection>(key);

  const paths = res.data.map((d) => {
    return {
      slug: d.attributes?.slug,
    };
  });

  return paths;
}


export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}): Promise<Metadata | null> {
  const brand = await getBrand(params.slug);

  if (!brand) {
    return null;
  }

  const seoImage = brand?.attributes?.seo?.metaImage?.data?.attributes;

  return {
    title: brand?.attributes?.seo?.metaTitle || brand?.attributes?.name,
    description: brand?.attributes?.seo?.metaDescription || dfDescription,
    alternates: {
      canonical: `https://www.jr.co.th/brands/${brand?.attributes?.slug}`,
    },
    openGraph: {
      url: `https://www.jr.co.th/brands/${brand?.attributes?.slug}`,
      title: brand?.attributes?.seo?.metaTitle || brand?.attributes?.name,
      description: brand?.attributes?.seo?.metaDescription || dfDescription,
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
      publishedTime: brand?.attributes?.createdAt,
      modifiedTime: brand?.attributes?.updatedAt,
    },
    keywords: brand.attributes?.seo?.keywords,
    robots: {
      follow: true,
      index: true,
    },
  };
}

const getBrand = async (slug: string) => {
  const brandKey = brandBySlug(slug);

  const [brand] = await Promise.all([
    fetcher<BrandEntityResponseCollection>(brandKey).then(
      (r) => r.data[0] || ""
    ),
  ]);

  return brand;
};

const Home = async ({ params }: { params: { slug: string } }) => {
  const brand = await getBrand(params.slug);

  return (
    <div>
      <div className="overflow-hidden container mx-auto px-2 md:px-8 lg:px-10 mt-8">
        <h1 className="text-slate-900 font-medium text-xl md:text-2xl font-sans my-4">
          {brand?.attributes?.seo?.metaTitle || brand?.attributes?.name}
        </h1>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 my-8 list-none">
          {brand?.attributes?.products?.data.map((p) => (
            <li key={p.id} className="col-span-1">
              <Link href={`/products/${p.attributes?.slug}`}>
                <ProductCard
                  imageUrl={
                    p.attributes?.coverImage?.data?.attributes?.url || ""
                  }
                  name={p.attributes?.name || ""}
                  slug={p.attributes?.slug || ""}
                  originalPrice={p.attributes?.originalPrice || 0}
                  discountPrice={p.attributes?.discountPrice || 0}
                />
              </Link>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden my-8">
          <RichText
            markup={brand?.attributes?.content || ""}
            className="font-body prose prose-sm lg:prose-sm"
          />
        </div>
      </div>
    </div>
  );
};



export const revalidate = 60;

export default Home;

import {
  ProductEntity,
  ProductEntityResponseCollection,
} from "@lib/@generated/graphql";
import { CtaBox } from "@components/molecules/cta-box";
import { ProductGallery } from "@components/organisms/products-gallery";
import { PdfCard } from "@components/molecules/pdf-card";
import Link from "next/link";
import { productBySlug } from "@lib/api/query/product-by-slug";
import { fetcher } from "@lib/api/fetcher";
import { HiOutlineShieldCheck, HiOutlineThumbUp } from "react-icons/hi";
import { allProducts } from "@lib/api/query/all-product";
import { Slogan } from "@components/organisms/slogan";
import { InstalmentDisclosure } from "@components/instalment-disclosure";
import { BsTelephoneFill } from "react-icons/bs";
import { LineButton } from "@components/organisms/line-button";
import { redirect } from 'next/navigation';
import { Metadata } from "next";

import striptags from "striptags";
import { BreadcrumbList, WithContext, Product, WebSite } from "schema-dts";

const generateMetaDescription = (text: string) => {
  const strippedText = striptags(text);
  const description = strippedText.substring(0, 150);
  return description;
};

interface PriceProps {
  originalPrice: number;
  discountPrice: number;
}

const Price: React.FC<PriceProps> = ({ originalPrice, discountPrice }) => (
  <div className="px-0 md:px-6 py-2 flex flex-row space-y-2 align-baseline">
    <div className="text-primary font-medium text-3xl md:text-2xl">
      {!!discountPrice && (
        <div className="rounded px-1 bg-red-600 text-white inline-block text-xl font-medium mr-2">
          {new Intl.NumberFormat("th-TH", {
            style: "percent",
            maximumFractionDigits: 0,
          }).format(discountPrice / originalPrice)}
        </div>
      )}
      {new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(originalPrice - discountPrice)}
    </div>
    {!!discountPrice && (
      <div className="text-gray-secondary font-normal text-base ml-2">
        <span className="line-through opacity-50">
          ปกติ
          {new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(originalPrice)}
        </span>
      </div>
    )}
  </div>
);

export const revalidate = 60;

export async function generateStaticParams() {
  const key = allProducts();

  const res = await fetcher<ProductEntityResponseCollection>(key).catch(() => ({ data: [] }));

  const paths = (res?.data || []).map((d) => {
    return {
      slug: d.attributes?.slug,
    };
  });

  return paths.filter((p) => p.slug?.length && p.slug?.length < 60);
}

interface ProductProps {
  slug: string;
  preview?: boolean;

  product: ProductEntity;
}

const getProduct = async (params: { slug: string }) => {
  const slug = decodeURIComponent(params?.slug);

  const productKey = productBySlug({
    slug,
    preview: false,
  });

  const res = await fetcher<ProductEntityResponseCollection>(productKey).then(
    (r) => r.data[0]
  );

  return res;
};

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params);

  const medias = product?.attributes?.medias?.data || [];

  if (!product) {
    redirect("/");
  }

  const seoDescription =
    product?.attributes?.seo?.metaDescription ||
    generateMetaDescription(product?.attributes?.description || "");

  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: product?.attributes?.category?.data?.attributes?.name,
        item:
          "https://www.jr.co.th/categories/" +
          product?.attributes?.category?.data?.attributes?.slug,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product?.attributes?.name,
        item: "https://www.jr.co.th/products/" + product?.attributes?.slug,
      },
    ],
  };

  const jsonLdProduct: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.attributes?.name,
    image: product?.attributes?.medias?.data?.map(
      (d) => d.attributes?.url || ""
    ),
    description: seoDescription,
    brand: product?.attributes?.brands?.data
      ?.map((b) => b?.attributes?.name)
      .join(","),
    sku: product?.attributes?.sku,
    category: product?.attributes?.category?.data?.attributes?.name,
    keywords: product?.attributes?.category?.data?.attributes?.name,
    offers: {
      "@type": "Offer",
      url: "https://www.jr.co.th/products/" + product?.attributes?.slug,
      priceCurrency: "THB",
      price:
        product?.attributes?.discountPrice ||
        product?.attributes?.originalPrice,
      itemCondition: "NewCondition",
      availability: "InStock",
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: {
          "@type": "QuantitativeValue",
          value: product?.attributes?.warrantyDuration || 2,
          unitText: product?.attributes?.warrantyDurationUnit || "YEARS",
        },
      },
    },
  };

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    headline: product?.attributes?.name,
    description: seoDescription,
    datePublished: product?.attributes?.createdAt,
    dateModified: product?.attributes?.updatedAt,
  };

  // const category = product?.attributes?.category?.data;

  // console.log(product.attributes?.brands?.data)

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <div className="container hidden md:block mx-auto py-2 px-4 md:px-8 lg:px-16">
        <div className="flex w-full breadcrumb text-sm font-normal overflow-x-scroll no-scrollbar mt-4 mb-8 border-b pb-6">
          <Link href="/" className="breadcrumb-item text-gray-500">
            HOME
          </Link>
          {product?.attributes?.category && (
            <Link
              href={
                "/categories/" +
                product?.attributes?.category?.data?.attributes?.slug
              }
              className="breadcrumb-item text-gray-500 uppercase"
            >
              {product?.attributes?.category?.data?.attributes?.name}
            </Link>
          )}
          <Link
            href={"/products/" + product?.attributes?.slug}
            className="breadcrumb-item text-gray-500 uppercase"
          >
            {product?.attributes?.name}
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-0 md:px-8 lg:px-16 bg-gray-100 md:bg-white">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-5">
                {medias.length && (
                  <ProductGallery
                    urls={medias?.map((m) => m.attributes?.url) as string[]}
                  />
                )}
              </div>
              <div className="col-span-12 md:col-span-7 bg-gray-100 md:bg-white">
                <div className="flex flex-col px-4 md:px-6 py-2 space-y-2 bg-white">
                  <ul className="list-none flex flex-row">
                    {product?.attributes?.brands?.data?.map((brand) => (
                      <li
                        className="text-primary font-light first:before:content-none before:content-[',\0000a0']"
                        key={brand?.id}
                      >
                        <Link href={`/brands/${brand?.attributes?.slug}`}>
                          {brand?.attributes?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <h1 className="text-slate-800 font-medium text-xl md:text-2xl">
                    {product?.attributes?.name}
                  </h1>
                </div>
                <div className="block sm:hidden bg-white pb-4">
                  <div className="px-4">
                    <Price
                      originalPrice={product?.attributes?.originalPrice || 0}
                      discountPrice={product?.attributes?.discountPrice || 0}
                    />
                  </div>
                </div>
                <div className="block md:hidden sticky bottom-0 py-4 bg-white border-t border-gray-100 px-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <a
                        href="tel:+6626918228"
                        className="inline-block text-primary border border-primary w-full bg-white hover:bg-primary-200 rounded-full px-4 py-3 text-center"
                      >
                        <BsTelephoneFill
                          className="inline-block mr-1 py-1"
                          size="1.5rem"
                        />
                        <span className="inline-block my-auto">
                          02-691-8228
                        </span>
                      </a>
                    </div>
                    <div className="col-span-1">
                      <LineButton title="สั่งซื้อสินค้า" className="py-3" />
                    </div>
                  </div>
                </div>
                <InstalmentDisclosure
                  instalment={product?.attributes?.instalment || 0}
                />
                {!!product?.attributes?.warrantyDuration && (
                  <div className="block sm:hidden px-4 bg-white my-2 py-4">
                    <HiOutlineShieldCheck
                      className="inline mr-4 text-gray-400"
                      size="1.5rem"
                    />
                    <span className="font-medium text-base text-slate-600">
                      การรับประกัน {product?.attributes?.warrantyDuration} ปี
                    </span>
                  </div>
                )}
                <div className="block sm:hidden px-4 bg-white my-2 py-4">
                  <HiOutlineThumbUp
                    className="inline mr-4 text-gray-400"
                    size="1.5rem"
                  />
                  <span className="font-medium text-base text-slate-600">
                    บริการ ติดตั้งฟรี
                  </span>
                </div>
                <div className="flex flex-col px-4 md:px-6 py-2 space-y-2 bg-white">
                  <div className="text-sm text-gray-secondary font-light hidden md:inline-block">
                    รหัสสินค้า: {product?.attributes?.sku}
                  </div>
                  {/* <div className="hidden md:flex flex-row text-sm text-gray-secondary font-light">
                    <span>แบรนด์:</span>
                    <ul className="list-none flex flex-row ml-2">
                      {product?.attributes?.brands?.data.map((brand) => (
                        <li
                          className="text-primary font-light first:before:content-none before:content-[',\0000a0']"
                          key={brand.id}
                        >
                          <Link href={`/brands/${brand.attributes?.slug}`}>
                            <a>{brand.attributes?.name}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                  <div>
                    <hr className="w-full border-t border-gray-200 my-4  hidden md:inline-block" />
                    <div className="text-gray-secondary whitespace-pre-wrap prose prose-sm prose-a:text-primary font-body">
                      {product?.attributes?.keyFeature && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product?.attributes?.keyFeature || "",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="flex flex-row space-x-2">
                    <span className="text-slate-600">
                      <b>แชร์</b>
                    </span>
                    <FacebookShareButton url="asd">
                      <div className="border border-primary rounded-full p-2">
                        <FaFacebookF className="text-primary text-sm" />
                      </div>
                    </FacebookShareButton>
                    <LineShareButton url="asd">
                      <div className="border border-primary rounded-full p-2">
                        <BsLine className="text-primary text-sm" />
                      </div>
                    </LineShareButton>
                  </div> */}
                </div>
              </div>
              <section className="col-span-12 mt-2 md:mt-8 overflow-hidden md:pr-8 px-4 md:px-0 bg-white py-4">
                <h2 className="text-slate-900 font-medium text-2xl font-sans w-full">
                  รายละเอียดสินค้า
                </h2>
                <div className="w-full text-gray-secondary whitespace-pre-wrap font-body prose max-w-full">
                  {/* <EmbedContainer
                    key={product.id}
                    markup={product?.attributes?.description || ""}
                  > */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product?.attributes?.description || "",
                    }}
                  />
                  {/* </EmbedContainer> */}
                </div>
              </section>
              {!!product?.attributes?.warrantyDescription && (
                <section className="col-span-12 mt-8 overflow-hidden px-4 md:px-0">
                  <h2 className="text-slate-900 font-medium text-2xl font-sans w-full">
                    การรับประกันสินค้า {product?.attributes?.name}
                  </h2>
                  <div className="text-sm text-gray-secondary">
                    {product?.attributes?.name}
                  </div>
                  <div className="w-full text-gray-secondary whitespace-pre-wrap font-body prose max-w-full">
                    {product?.attributes?.warrantyDescription && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            product?.attributes?.warrantyDescription || "",
                        }}
                      />
                    )}
                  </div>
                </section>
              )}
              {!!product?.attributes?.specification && (
                <section className="col-span-12 mt-2 md:mt-8 overflow-hidden md:pr-8 px-4 md:px-0 bg-white py-4">
                  <h2 className="text-slate-900 font-medium text-2xl font-sans w-full">
                    คุณลักษณะสินค้า
                  </h2>
                  <div className="w-full text-gray-secondary whitespace-pre-wrap font-body prose max-w-full">
                    {product?.attributes?.specification && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product?.attributes?.specification || "",
                        }}
                      />
                    )}
                  </div>
                </section>
              )}
              {!!product?.attributes?.files?.data?.length && (
                <section className="col-span-12 my-2 md:mt-8 overflow-hidden md:pr-8 px-4 md:px-0 bg-white py-4">
                  <h2 className="text-slate-900 font-medium text-2xl font-sans w-full">
                    ดาวน์โหลดข้อมูลสินค้า
                  </h2>
                  <div className="w-full py-4 grid grid-cols-2 gap-2">
                    {product?.attributes?.files?.data?.map((f) => (
                      <div
                        className="col-span-2 md:col-span-1 shadow-light"
                        key={f.id}
                      >
                        <PdfCard
                          url={f.attributes?.url}
                          name={f.attributes?.name}
                          size={f.attributes?.size}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 hidden md:block">
            <div className="sticky top-24">
              <CtaBox
                discountPrice={product?.attributes?.discountPrice || 0}
                originalPrice={product?.attributes?.originalPrice || 0}
                instalment={product?.attributes?.instalment || 0}
                warrantyDuration={product?.attributes?.warrantyDuration || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <Slogan />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | null> {
  const product = await getProduct(params);

  if (!product) {
    return null;
  }

  return {
    title: product?.attributes?.seo?.metaTitle || product?.attributes?.name,
    description:
      product?.attributes?.seo?.metaDescription ||
      generateMetaDescription(product?.attributes?.description || ""),
    alternates: {
      canonical: `https://www.jr.co.th/products/${product?.attributes?.slug}`,
    },
    openGraph: {
      url: `https://www.jr.co.th/products/${product?.attributes?.slug}`,
      title: product?.attributes?.seo?.metaTitle || product?.attributes?.name,
      description:
        product?.attributes?.seo?.metaDescription ||
        generateMetaDescription(product?.attributes?.description || ""),
      images: product?.attributes?.medias?.data?.map((m) => ({
        url: m?.attributes?.url || "",
        width: m?.attributes?.width || 300,
        height: m?.attributes?.height || 300,
        alt: m?.attributes?.alternativeText || "",
        type: m?.attributes?.mime,
      })),
      siteName: "jr.co.th",
      type: "article",
    },
    keywords: product.attributes?.seo?.keywords,
    robots: {
      follow: true,
      index: true,
    },
  };
}
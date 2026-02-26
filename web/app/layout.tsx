/* eslint-disable @next/next/no-head-element */
import "../styles/globals.css";
import "../styles/breadcrumb.css";

import { allCategories } from "@lib/api/query/all-categories";
import { fetcher } from "@lib/api/fetcher";
import {
  flattenCategories,
  transformToHierarchy,
} from "@lib/transformer/category-hierarchy";
import { CategoryEntityResponseCollection } from "@lib/@generated/graphql";
import { Prompt, Sarabun } from "@next/font/google";
import { Navbar } from "@components/molecules/navbar";
import { FooterCategoies } from "@components/organisms/categoies-footer";
import { Footer } from "@components/organisms/footer";
import { FloatingSocial } from "@components/organisms/floating-social";
import { LiveChat } from "@components/organisms/live-chat";
import Script from "next/script";
import { GTM_ID } from "@lib/gtm";
import NextTopLoader from "nextjs-toploader";
import { orderBy } from "lodash";

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const sarabun = Sarabun({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const getCategories = async () => {
  try {
    const categoiesKey = allCategories();

    const hierarchy = await fetcher<CategoryEntityResponseCollection>(
      categoiesKey
    ).then((c) => transformToHierarchy(c?.data || []));

    const flattened = flattenCategories(hierarchy);

    return orderBy(flattened, (f) => f.children.length, "desc");
  } catch {
    return [];
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  return (
    <html
      className={`${prompt.variable} ${sarabun.variable} font-sans`}
      lang="TH"
    >
      <link rel="shortcut icon" href="/favicon.ico" />
      <head />
      {!!GTM_ID && (
        <Script
          id="gtag-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
          }}
        />
      )}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', 'GTM-5VCWHKGL');
          `,
        }}
      />
      <body>
        {!!GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-5VCWHKGL`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* <Analytics /> */}
        <NextTopLoader
          color="#1877F2"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />
        <Navbar />
        <div className="mb-14 md:mb-20" />
        {children}
        <FooterCategoies categories={categories} />
        <Footer />
        <FloatingSocial />
        <LiveChat />
      </body>
    </html>
  );
}

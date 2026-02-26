import { getServerSideSitemap } from "next-sitemap";
import { CategoryEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allCategories } from "@lib/api/query/all-categories";
import { transformToHierarchy } from "@lib/transformer/category-hierarchy";

export async function GET(request: Request) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  const categoiesKey = allCategories();

  const categoies = await fetcher<CategoryEntityResponseCollection>(
    categoiesKey
  ).then((c) => transformToHierarchy(c.data));

  return getServerSideSitemap(
    categoies.map((c) => ({
      loc: "https://jr.co.th/categories/" + c.attributes?.slug,
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    }))
  );
}

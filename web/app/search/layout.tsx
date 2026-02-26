import { CategoryEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allCategories } from "@lib/api/query/all-categories";
import { transformToHierarchy } from "@lib/transformer/category-hierarchy";
import Link from "next/link";
import { Slogan } from "@components/organisms/slogan";

const getServerSideProps = async () => {
  const categoiesKey = allCategories();

  const [categories] = await Promise.all([
    fetcher<CategoryEntityResponseCollection>(categoiesKey).then((c) =>
      transformToHierarchy(c?.data || [])
    ).catch(() => []),
  ]);

  return { categories: categories || [] };
};

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories } = await getServerSideProps();

  return (
    <section className="block w-full">
      <div className="container mx-auto py-2 px-4 md:px-8 lg:px-16 mt-32">
        <div className="float-left w-[220px] hidden md:flex md:flex-col pr-4 gap-4">
          {!!categories?.length && (
            <div className="text-gray-secondary">
              <div className="text-primary-500 font-semibold text-lg mb-2">
                หมวดหมู่สินค้า
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="text-slate-700 hover:text-primary-500"
                  >
                    <Link
                      href={"/categories/" + c.attributes?.slug}
                      className="flex flex-row"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
                      />
                      {c.attributes?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <main className="ml-0 md:ml-[240px] mb-16">
          {children}
          <div className="mt-8" />
        </main>
      </div>
      <Slogan />
    </section>
  );
}

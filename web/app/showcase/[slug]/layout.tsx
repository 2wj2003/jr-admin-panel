import { ProvinceEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allProvinces } from "@lib/api/query/all-province";
import Link from "next/link";

const getProvinces = async () => {
  const provinceKey = allProvinces();

  const res = await fetcher<ProvinceEntityResponseCollection>(provinceKey);

  return res.data;
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  const provinces = await getProvinces();

  return (
    <div>
      {children}
      <div className="bg-slate-100 py-6">
        <div className="overflow-hidden container mx-auto px-2 md:px-8 lg:px-10">
          <h2 className="text-slate-900 font-medium text-base font-sans mb-4">
            ผลงานการติดตั้งตามจังหวัด
          </h2>
          <ul className="grid grid-cols-3 md:grid-cols-6 gap-1">
            {provinces.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/showcases/p/${p.attributes?.slug}`}
                  className="text-xs text-primary hover:text-primary-600"
                >
                  {p.attributes?.name_th}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

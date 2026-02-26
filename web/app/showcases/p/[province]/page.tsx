import ShowcaseCard from "@components/organisms/showcase-card";
import {
  ProvinceEntityResponseCollection,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { getApiUrl } from "@lib/api/get-url";
import { provinceBySlug } from "@lib/api/query/province-by-slug";
import { showcase } from "@lib/api/query/showcase";
const qs = require('qs');

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

  const key = `${apiUrl}/api/provinces?${query}`;

  const res = await fetcher<ShowcaseEntityResponseCollection>(key);

  const paths = res.data.map((d) => {
    return {
      province: d.attributes?.slug
    };
  });

  return paths;
}

const getData = async (slug: string) => {
  const cctvsKey = showcase(
    {
      province: {
        slug: {
          $eq: slug,
        },
      },
    },
    { page: 1, pageSize: 20 }
  );

  const provinceKey = provinceBySlug(slug);

  const [showcases, province] = await Promise.all([
    fetcher<ShowcaseEntityResponseCollection>(cctvsKey).then((r) => r.data || []),
    fetcher<ProvinceEntityResponseCollection>(provinceKey).then(
      (r) => r.data[0] || ""
    ),
  ]);

  return { showcases, province };
};

const Showcase = async ({
  params,
}: {
  params: { province: string };
}) => {
  const { showcases, province } = await getData(params.province);

  return (
    <div>
      <div className="container mx-auto px-2 md:px-8 lg:px-10 mb-16">
        <h1 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
          ผลงานการติดตั้งงหวัด{province?.attributes?.name_th}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {showcases.map((showcase) => (
            <ShowcaseCard {...showcase} key={showcase.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const revalidate = 60;

export default Showcase;

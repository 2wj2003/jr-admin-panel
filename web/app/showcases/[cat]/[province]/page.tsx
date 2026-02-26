import ShowcaseCard from "@components/organisms/showcase-card";
import {
  Enum_Showcase_Type,
  ProvinceEntityResponseCollection,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { getApiUrl } from "@lib/api/get-url";
import { provinceBySlug } from "@lib/api/query/province-by-slug";
import { showcase } from "@lib/api/query/showcase";
import { Metadata } from "next";

const qs = require("qs");

export async function generateStaticParams() {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      pagination: {
        pageSize: 1000,
      },
    },
    { encodeValuesOnly: true }
  );

  const key = `${apiUrl}/api/provinces?${query}`;

  const res = await fetcher<ShowcaseEntityResponseCollection>(key).catch(() => ({ data: [] }));


  const cctvs = (res?.data || []).map((d) => {
    return {
      province: d.attributes?.slug,
      cat: "cctvs",
    };
  });

  const autogate = (res?.data || []).map((d) => {
    return {
      province: d.attributes?.slug,
      cat: "autogate",
    };
  });
  const solar = (res?.data || []).map((d) => {
    return {
      province: d.attributes?.slug,
      cat: "solar-cell",
    };
  });

  return [...cctvs, ...autogate, ...solar];
}

const getCat = (cat: string) => {
  switch (cat) {
    case "cctvs":
      return Enum_Showcase_Type.Cctv;

    case "autogate":
      return Enum_Showcase_Type.Atg;
    case "solar-cell":
      return Enum_Showcase_Type.Solar;

    default:
    case "cctvs":
      return Enum_Showcase_Type.Cctv;
  }
};

const getData = async (slug: string, category: string) => {
  const cat = getCat(category);

  const cctvsKey = showcase(
    {
      type: {
        $eq: cat,
      },
      province: {
        slug: {
          $eq: slug,
        },
      },
    },
    { page: 1, pageSize: 100 }
  );

  const provinceKey = provinceBySlug(slug);

  const [showcases, province] = await Promise.all([
    fetcher<ShowcaseEntityResponseCollection>(cctvsKey).then(
      (r) => r.data || []
    ),
    fetcher<ProvinceEntityResponseCollection>(provinceKey).then(
      (r) => r.data[0] || ""
    ),
  ]);


  return { showcases, province };
};

export async function generateMetadata({
  params,
}: {
  params: { province: string; cat: string };
}): Promise<Metadata> {
  const { province } = await getData(params.province, params.cat);

  return {
    title: "รีวิว ผลงานการติดตั้ง" + province?.attributes?.name_th,
    description:
      "บริการติดตั้งและจัดจำหน่าย ระบบกล้องวงจรปิด CCTV ประตูรีโมท และโซล่าเซลล์ ทั่วประเทศ การันตีคุณภาพกว่า 35 ปี",
    openGraph: {
      type: "article",
      url: "https://www.jr.co.th",
      siteName: "jr.co.th",
    },
  };
}

const Showcase = async ({
  params,
}: {
  params: { province: string; cat: string };
}) => {
  const { showcases, province } = await getData(params.province, params.cat);

  return (
    <div>
      <div className="container mx-auto px-2 md:px-8 lg:px-10 mb-16">
        <h1 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
          ผลงานการติดตั้งหวัด{province?.attributes?.name_th}
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

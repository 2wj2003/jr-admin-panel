import ShowcaseCard from "@components/organisms/showcase-card";
import {
  Enum_Showcase_Type,
  ShowcaseEntity,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { showcase } from "@lib/api/query/showcase";

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

const getData = async (category: string) => {
  const cat = getCat(category);

  const cctvsKey = showcase(
    {
      type: {
        $eq: cat,
      },
    },
    { page: 1, pageSize: 100 }
  );

  const [showcases] = await Promise.all([
    fetcher<ShowcaseEntityResponseCollection>(cctvsKey).then((r) => r.data || []),
  ]);

  return { showcases };
};

export async function generateStaticParams() {
  return [{ cat: "cctvs" }, { cat: "autogate" }, { cat: "solar-cell" }];
}

const Showcase = async ({ params }: { params: { cat: string } }) => {
  const { showcases } = await getData(params.cat);

  return (
    <div>
      <div className="container mx-auto px-2 md:px-8 lg:px-10 mb-16">
        <h2 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
          ผลงานการติดตั้ง
        </h2>
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

import Image from "next/image";
import ShowcaseCard from "@components/organisms/showcase-card";
import {
  Enum_Showcase_Type,
  ProvinceEntity,
  ShowcaseEntity,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { allProvinces } from "@lib/api/query/all-province";
import { showcase } from "@lib/api/query/showcase";
import { showcaseCategories } from "@lib/consts/showcase-categories";
import Link from "next/link";

interface PageProps {
  cctvs: ShowcaseEntity[];
  atgs: ShowcaseEntity[];

  solars: ShowcaseEntity[];

  showcase: ShowcaseEntity;

  provinces: ProvinceEntity[];
}

const getData = async () => {
  const cctvsKey = showcase(
    {
      type: {
        $eq: Enum_Showcase_Type.Cctv,
      },
    },
    { page: 1, pageSize: 8 }
  );
  const atgKey = showcase(
    {
      type: {
        $eq: Enum_Showcase_Type.Atg,
      },
    },
    { page: 1, pageSize: 8 }
  );
  const solarJKey = showcase(
    {
      type: {
        $eq: Enum_Showcase_Type.Solar,
      },
    },
    {
      page: 1,
      pageSize: 8,
    }
  );

  const [cctvs, atgs, solars] = await Promise.all([
    fetcher<ShowcaseEntityResponseCollection>(cctvsKey).then((r) => r.data || []).catch(() => []),
    fetcher<ShowcaseEntityResponseCollection>(atgKey).then((r) => r.data || []).catch(() => []),
    fetcher<ShowcaseEntityResponseCollection>(solarJKey).then((r) => r.data || []).catch(() => []),
  ]);

  return {
    cctvs,
    atgs,
    solars,
  };
};

const Showcase = async () => {
  const { solars, cctvs, atgs } = await getData();

  return (
    <div>
      {/* <NextSeo
        title="Using More of Config"
        description="This example uses more of the available config options."
        canonical="https://www.jr.co.th/showcases"
        openGraph={{
          url: "https://www.jr.co.th/showcases",
          title: "Open Graph Title",
          description: "Open Graph Description",
        }}
      /> */}
      {/* <Navbar /> */}
      <div className="container mx-auto px-2 md:px-8 lg:px-10 mb-16">
        <h1 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
          ประเภทริวิว
        </h1>
        <div className="flex flex-row gap-2 w-full overflow-x-scroll">
          {showcaseCategories.map((c) => (
            <Link
              href={c.target}
              key={c.imageUrl}
              className="relative flex-[0_0_80%] md:flex-[0_0_33%]"
            >
              <Image
                className="overflow-hidden rounded"
                loading="eager"
                alt={""}
                width={600}
                height={230}
                src={c.imageUrl}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Link>
          ))}
        </div>
        {!!(cctvs || []).length && (
          <>
            <h2 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
              กล้องวงจรปิด
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {cctvs.map((cctv) => (
                <ShowcaseCard {...cctv} key={cctv.id} />
              ))}
            </div>
            <Link
              href="/showcases/cctvs"
              className="block bg-transparent px-4 py-3 my-8 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
            >
              ดูรีวิวกล้องวงจรปิดอื่นๆ
            </Link>
          </>
        )}
        {!!(atgs || []).length && (
          <>
            <h2 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
              ประตูอัตโนมัติ
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {atgs.map((atg) => (
                <ShowcaseCard {...atg} key={atg.id} />
              ))}
            </div>
            <Link
              href="/showcases/autogate"
              className="block bg-transparent px-4 py-3 my-8 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
            >
              ดูรีวิวประตูอัตโนมัติอื่นๆ
            </Link>
          </>
        )}
        {!!(solars || []).length && (
          <>
            <h2 className="mt-4 mb-4 text-2xl font-medium text-slate-900">
              โซล่าเซลล์
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {solars.map((solar) => (
                <ShowcaseCard {...solar} key={solar.id} />
              ))}
            </div>
            <Link
              href="/showcases/solar-cell"
              className="block bg-transparent px-4 py-3 my-8 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
            >
              ดูรีวิวโซล่าเซลล์อื่นๆ
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export const revalidate = 60;

export default Showcase;

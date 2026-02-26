import { VerifyIcon } from "@components/icons/verify";
import Image from "next/image";
import { BsFillTelephoneFill, BsLine } from "react-icons/bs";
import { HiOutlineClock, HiOutlineShieldCheck } from "react-icons/hi";
import { HiOutlineBolt, HiOutlineDocumentCheck } from "react-icons/hi2";
import Link from "next/link";
import { fetcher } from "@lib/api/fetcher";
import { allBrands } from "@lib/api/query/all-brands";
import {
  BrandEntityResponseCollection,
  Enum_Showcase_Type,
  ProductEntityResponseCollection,
  ShowcaseEntityResponseCollection,
} from "@lib/@generated/graphql";
import { showcase } from "@lib/api/query/showcase";
import ShowcaseCard from "@components/organisms/showcase-card";
import { Faq } from "../../components/molecules/faq";
import ProductCard from "@components/organisms/product-card";
import { productSerach } from "@lib/api/query/search-product";
import { Slogan } from "@components/organisms/slogan";
import { Metadata } from "next";

const getStaticProps = async () => {
  const brandKey = allBrands();
  const showcaseKey = showcase(
    {
      type: {
        $eq: Enum_Showcase_Type.Atg,
      },
    },
    { page: 1, pageSize: 4 }
  );

  const productKey = productSerach({
    category: "autogate",
  });
  const [brands, showcases, products] = await Promise.all([
    fetcher<BrandEntityResponseCollection>(brandKey),
    fetcher<ShowcaseEntityResponseCollection>(showcaseKey).then((r) => r.data),
    fetcher<ProductEntityResponseCollection>(productKey).then((r) => r.data),
  ]);

  return {
    brands,
    showcases,
    products,
  };
};

interface TimelineProps {
  no: number;
  title: string;
  desc: string;
}

const Timeline: React.FC<TimelineProps> = ({ no, title, desc }) => (
  <li className="ml-6">
    <span className="flex absolute -left-3 justify-center items-center w-6 h-6 rounded-full bg-primary-600">
      <div className="text-white">{no}</div>
    </span>
    <h3 className="flex items-center mb-1 text-2xl font-semibold text-slate-900">
      {title}
    </h3>
    <div className="text-slate-600 text-base font-body">{desc}</div>
  </li>
);

export default async function CCTV() {
  const { brands, showcases, products } = await getStaticProps();

  return (
    <>
      <section className="relative bg-gradient-to-b from-[#2FB382] to-[#067445]">
        <div className="container mx-auto px-4 md:px-8 lg:px-10 bg-no-repeat bg-contain bg-top md:bg-none md:bg-left-top md:bg-[length:600px]">
          <div className="flex flex-col gap-10 md:grid md:grid-cols-2">
            <div className="flex flex-col gap-6 md:col-span-1 pt-8 md:pt-16 pb-0 md:pb-16">
              <div className="text-white text-center px-6 pt-16 md:pt-8 flex flex-col gap-2">
                <span className="block text-2xl">
                  รับปรึกษา จำหน่าย ติดตั้ง
                </span>
                <h1 className="block text-4xl font-bold">
                  ประตูรีโมทจากอิตาลี
                </h1>
                <span className="block text-2xl">
                  ทุกสถานที่ ดูแลต้นจนจบ ครบวงจร
                </span>
              </div>
              <div className="text-base text-white text-center">
                ด้วยทีมช่างมืออาชีพและประสบการณ์มากกว่า 5 ปี
                และติดตั้งมาแล้วมากกว่า 10,000 งาน
              </div>
              <div className="flex gap-4 md:gap-8 flex-col">
                <div className="flex gap-4 flex-col">
                  <a
                    className="bg-white px-4 py-3 text-center rounded-full space-x-1 w-full max-w-md mx-auto text-primary-600 hover:text-primary-400"
                    href="https://lin.ee/s2DE4uk"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsLine className="text-line inline w-5 h-5" />
                    <span className="text-lg font-bold">ปรึกษาฟรี!</span>
                  </a>
                  <a
                    className="bg-transparent px-4 py-3 text-center rounded-full space-x-1 w-full border border-white max-w-md mx-auto text-white hover:bg-white hover:text-primary-600"
                    href="tel:+666-614-63289"
                  >
                    <BsFillTelephoneFill className="inline w-5 h-5" />
                    <span className="text-lg font-medium">
                      โทร 066-146-3289
                    </span>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3 mx-auto text-left md:text-center">
                  <div className="text-white">
                    <VerifyIcon className="w-5 h-5 inline-block mr-1" />
                    <span>สำรวจพื้นที่ ฟรี</span>
                  </div>
                  <div className="text-white ">
                    <VerifyIcon className="w-5 h-5 inline-block mr-1" />
                    <span>ติดตั้งฟรี ทั่วไทย</span>
                  </div>
                  <div className="text-white">
                    <VerifyIcon className="w-5 h-5 inline-block mr-1" />
                    <span>ผ่อน 0% 6 เดือน</span>
                  </div>
                  <div className="text-white ">
                    <VerifyIcon className="w-5 h-5 inline-block mr-1" />
                    <span>รับประกันสูงสุด 2 ปี</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full md:max-w-lg items-center object-center mx-auto md:col-span-1 mt-auto">
              <Image
                src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/Instagram_post_1_3_72cf8a2c75.png"
                width="500"
                height="500"
                alt=""
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 md:px-8 lg:px-10 py-8 md:py-16 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 relative w-full md:max-w-lg items-center object-center mx-auto mt-auto my-auto">
            <Image
              src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/Cover_Page_Autogate_64f677f9b6.png"
              width="1016"
              height="624"
              alt=""
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="col-span-1 my-auto">
            <div className="text-center flex flex-col mb-6 md:mb-8">
              <div className="text-slate-600 font-body">
                บริการก่อน-หลังการขาย
              </div>
              <h2 className="text-3xl text-primary-600 font-bold">
                ออกแบบให้ ติดตั้งให้ <br />
                ดูแลให้ ไว้ใจได้
              </h2>
            </div>
            <div className="block px-6">
              <ol className="relative flex flex-col border-l border-primary-200 border-dashed gap-4">
                <Timeline
                  no={1}
                  title="ปรึกษาเรา"
                  desc="เก็บรายละเอียดความต้องการของลูกค้า"
                />
                <Timeline
                  no={2}
                  title="สำรวจพื้นที่จริง"
                  desc="ทีมช่างเข้าสำรวจพื้นที่ติดตั้งจริงเพื่อเก็บข้อมูล"
                />
                <Timeline
                  no={3}
                  title="เลือกออกแบบตามใจชอบ"
                  desc="ทางเราจะเสนอตัวเลือกสินค้าที่เหมาะสม ลูกค้าสามารถปรับแต่งได้"
                />
                <Timeline
                  no={4}
                  title="ติดตั้ง ดูแล รับประกัน"
                  desc="ติดตั้งตามแบบ พร้อมดูแลและรับประกันหลัง
              การติดตั้ง"
                />
              </ol>
            </div>
            <Link
              href="/showcases"
              className="bg-transparent px-4 py-3 block mt-8 text-center rounded-full w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
            >
              ดูผลงานของเรา
            </Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 md:px-8 lg:px-10 py-8 md:py-16 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div className="col-span-1 my-auto gap-4">
            <div className="text-center flex flex-col gap-2 mb-6 md:mb-8">
              <div className="text-slate-600 font-body">การรับประกันสินค้า</div>
              <h2 className="text-3xl text-primary-600 font-bold">
                เคลมได้ ซ่อมได้ เข้าศูนย์ได้ หายห่วง
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1 bg-slate-100 rounded-2xl p-4">
                <div className="bg-primary-50 p-2 rounded-lg inline-block">
                  <HiOutlineClock className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center mb-1 text-lg font-semibold text-slate-900">
                  เคลมฟรีใน 5 วัน
                </div>
                <div className="text-slate-600 text-sm font-body">
                  ช้อปอย่างมั่นใจ เพราะเรายินดีรับสินค้ามาเคลมฟรีภายใน 5 วัน
                </div>
              </div>
              <div className="col-span-1 bg-slate-100 rounded-2xl p-4">
                <div className="bg-primary-50 p-2 rounded-lg inline-block">
                  <HiOutlineDocumentCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center mb-1 text-lg font-semibold text-slate-900">
                  ประกันศูนย์แท้
                </div>
                <div className="text-slate-600 text-sm font-body">
                  สินค้าทุกชิ้นมีประกัน สามารถเข้าศูนย์เพื่อรับบริการได้ทันที
                </div>
              </div>
              <div className="col-span-1 bg-slate-100 rounded-2xl p-4">
                <div className="bg-primary-50 p-2 rounded-lg inline-block">
                  <HiOutlineBolt className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center mb-1 text-lg font-semibold text-slate-900">
                  ซ่อมด่วน 48 ชม.
                </div>
                <div className="text-slate-600 text-sm font-body">
                  หากมีปัญหา ทีมช่างพร้อมซ่อมด่วนหน้างานใน 48 ชม
                </div>
              </div>
              <div className="col-span-1 bg-slate-100 rounded-2xl p-4">
                <div className="bg-primary-50 p-2 rounded-lg inline-block">
                  <HiOutlineShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center mb-1 text-lg font-semibold text-slate-900">
                  การรับประกัน
                </div>
                <div className="text-slate-600 text-sm font-body">
                  รับประกันงานติดตั้ง 2 ปีเต็มบริการหน้างานฟรีตลอด 6 เดือน
                </div>
              </div>
            </div>
            <Link
              href="/contents/warranty"
              className="bg-transparent block mt-8 px-4 py-3 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
            >
              ดูรายละเอียดประกันสินค้า
            </Link>
          </div>
          <div className="col-span-1 relative w-full md:max-w-lg items-center object-center mx-auto mt-auto my-auto">
            {/* <Image
              src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/landing_1fdebc80ff.png"
              width="500"
              height="500"
              alt=""
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            /> */}
            <iframe
              // width="560"
              // height="315"
              className="aspect-square w-full"
              src="https://www.youtube.com/embed/bne80E2kymU"
              title="YouTube video player"
              // frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              // allowfullscreen
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 md:px-8 lg:px-10 py-8 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <div className="text-slate-600 font-body">ผลงานของเรา</div>
          <h2 className="text-3xl text-primary-600 font-bold">
            ติดตั้งให้ฟรี ดูผ่านทีวีหรือมือถือได้เลย
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {showcases.map((cctv) => (
            <ShowcaseCard {...cctv} key={cctv.id} />
          ))}
        </div>
        <Link
          href="/showcases/autogate"
          className="bg-transparent px-4 py-3 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
        >
          ดูรีวิวการติดตั้ง
        </Link>
      </section>
      <section className="container mx-auto px-4 md:px-8 lg:px-10 py-8 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl text-primary-600 font-bold">
            คำถามที่พบบ่อย
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <Faq
            question="รับประกันสินค้ากี่ปี"
            answer="การรับประกันสินค้ารับจากวันที่ติดตั้ง โดยการรับประกันสินค้าจะมีอายุ 2 ปี"
          />
          <Faq
            question="อุปกรณ์ชุดมอเตอร์มีอะไรบ้าง"
            answer="มอเตอร์ เซนเซอร์ป้องกันประตูหนีบ และรีโมทจำนวน 2 ตัว (จำนวนรีโมท อาจเปลี่ยนตามโปรโมชั่น) ออปชั่นเสริม ไวไฟเปิด-ปิด ผ่านมือถือ และ ไฟหัวเสาเปิด-ปิด เวลา มอเตอร์ใช้งาน"
          />
          <Faq
            question="ประตูรีโมทต้องคล้องกุญแจไหม"
            answer="สามารถล็อคแทนกุญแจล๊อครั้วบ้าน และป้องกันการลืมล๊อคประตูบ้าน เพราะจะสามารถปิดประตูรั้วบ้านได้สุดรางเลื่อน เมื่อประตูปิดจะล็อกเองอัตโนมัติ ไม่ควรคล้องแม่กุญแจ เพราะหากเผลอกดรีโมท ประตูอาจโดนรั้งจนมอเตอร์พังได้"
          />
          <Faq
            question="ถ้าไฟดับ จะเปิดปิดประตูยังไง"
            answer="สามารถปลดล็อกที่มอเตอร์ แล้วใช้มือเลื่อนเปิดปิดประตูตามปกติได้ หรือเลือกติดตั้งเป็น มอเตอร์แบบ DC เนื่องจาก มอเตอร์แบบ DC มีแบตในตัวสามารถใช้งานได้แม้ไฟดับ"
          />
        </div>
        <Link
          href="/contents/faq"
          className="bg-transparent px-4 py-3 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
        >
          ดูคำถามอื่นๆ
        </Link>
      </section>
      <section className="container mx-auto px-4 md:px-8 lg:px-10 py-8 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <div className="text-slate-600 font-body">รายการสินค้า</div>
          <h2 className="text-3xl text-primary-600 font-bold">ชุดประตูรีโมท</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              imageUrl={
                product.attributes?.coverImage?.data?.attributes?.url || ""
              }
              name={product.attributes?.name || ""}
              slug={product.attributes?.slug || ""}
              originalPrice={product.attributes?.originalPrice || 0}
              discountPrice={product.attributes?.discountPrice || 0}
            />
          ))}
        </div>
        <Link
          href="/categories/cctv"
          className="bg-transparent px-4 py-3 text-center rounded-full space-x-1 w-full border border-primary-500 text-primary-500 text-lg font-medium hover:bg-primary-500 hover:text-white max-w-md mx-auto"
        >
          ดูสินค้าเพิ่มเติม
        </Link>
      </section>
      <section className="container mx-auto px-0 md:px-8 lg:px-10 py-8 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <div className="text-slate-600 font-body">ช้อปตามแบรนด์ดัง</div>
          <h2 className="text-3xl text-primary-600 font-bold">
            คุณภาพดี มีประกัน
          </h2>
        </div>
        <ul className="grid grid-cols-4 md:grid-cols-6 gap-4 place-items-center items-center justify-center">
          {brands?.data?.map((b) => (
            <li key={b.id} className="relative col-span-1 h-16 w-28">
              <Link href="/brands/[slug]" as={`/brands/${b.attributes?.slug}`}>
                <Image
                  src={b.attributes?.logo?.data?.attributes?.url || ""}
                  // width={300}
                  // height={300}
                  // layout="responsive"
                  // objectFit="contain"
                  // objectPosition="center"
                  loading="lazy"
                  // placeholder="blur"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "contain",
                  }}
                  alt={
                    b.attributes?.logo?.data?.attributes?.alternativeText || ""
                  }
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Slogan />
    </>
  );
}

export const metadata: Metadata = {
  title: "ประตูรีโมทแบบบานเลื่อน และบานเฟี้ยม พร้อมติดตั้งทั่วประเทศไทย",
  description:
    "ประตูรีโมทรั้วนาเน่ อิตาลีพันธุ์แท้ รองรับน้ำหนักได้เยอะ ติดตั้งโดยทีมช่างมืออาชีพ พร้อมรับประกัน 2 ปีเต็ม การันตีคุณภาพกว่า 35 ปี",
  openGraph: {
    type: "article",
    url: "https://www.jr.co.th/autogate",
    siteName: "jr.co.th",
    title: "ประตูรีโมทแบบบานเลื่อน และบานเฟี้ยม พร้อมติดตั้งทั่วประเทศไทย",
    description:
      "ประตูรีโมทรั้วนาเน่ อิตาลีพันธุ์แท้ รองรับน้ำหนักได้เยอะ ติดตั้งโดยทีมช่างมืออาชีพ พร้อมรับประกัน 2 ปีเต็ม การันตีคุณภาพกว่า 35 ปี",
  },
  alternates: {
    canonical: "https://www.jr.co.th/autogate",
  },
  robots: {
    follow: true,
    index: true,
  },
};
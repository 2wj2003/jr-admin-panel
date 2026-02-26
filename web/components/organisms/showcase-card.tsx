import Image from "next/image";
import { ShowcaseEntity } from "@lib/@generated/graphql";
import Link from "next/link";

export interface ShowcaseCardProps extends ShowcaseEntity {}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  id,
  attributes,
}) => {
  return (
    <Link href={`/showcase/${attributes?.slug}`}>
      <div className="bg-white overflow-hidden rounded-lg border border-gray-100 cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out hover:shadow-light">
        <div className="relative">
          <Image
            sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            src={attributes?.cover?.data?.attributes?.url || ""}
            width={1080}
            height={720}
            style={{
              width: "100%",
              height: "auto",
            }}
            alt={attributes?.cover.data?.attributes?.alternativeText || ""}
            title={attributes?.cover.data?.attributes?.alternativeText || ""}
          />
        </div>
        <div className="flex flex-col space-y-2 px-2 md:px-4 py-4">
          <div className="text-base text-slate-600 font-normal">
            <span className="line-clamp-2 ">{attributes?.title}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowcaseCard;

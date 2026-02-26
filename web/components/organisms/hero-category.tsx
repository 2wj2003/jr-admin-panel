"use client";
import Image from "next/image";
import { ComponentSharedBanner, Maybe } from "@lib/@generated/graphql";
import cx from "classnames";
import { useState } from "react";
import { DotCarousel } from "./dot-carousel";
import Link from "next/link";

export interface HeroMunuProps {
  menus: Maybe<Array<Maybe<ComponentSharedBanner>>>;
}
export interface HeroCategoryProps extends HeroMunuProps {
  banners: Maybe<Array<Maybe<ComponentSharedBanner>>>;
}

const HeroMunu: React.FC<HeroMunuProps> = ({ menus }) => {
  if (!menus) {
    return null;
  }

  return (
    <div className="w-full md:w-1/4 grid grid-cols-2 md:flex md:flex-col gap-1 px-2 md:px-0 pt-1 md:mt-0">
      {menus?.map((c) => (
        <Link
          key={c?.id}
          href={c?.link || ""}
          target={c?.target || "_self"}
          id={c?.tagId || ""}
        >
          <Image
            src={c?.image.data?.attributes?.url || ""}
            width={300}
            height={115}
            className="overflow-hidden rounded md:rounded col-span-1"
            loading="eager"
            sizes="(max-width: 480px) 150px, 300px"
            style={{ objectFit: "cover" }}
            alt={c?.image.data?.attributes?.alternativeText || ""}
          />
        </Link>
      ))}
    </div>
  );
};

export const HeroCategory: React.FC<HeroCategoryProps> = ({
  banners,
  menus,
}) => {
  const [hoverItem, setHover] = useState<any>(null);

  const [delayHandler, setDelayHandler] = useState<any>(null);

  const handleMouseEnter = (category: any) => {
    setDelayHandler(
      setTimeout(() => {
        setHover(category);
      }, 200)
    );
  };

  const handleMouseLeave = () => {
    if (delayHandler) {
      clearTimeout(delayHandler);
    }
    setTimeout(() => {
      setHover(null);
    }, 200);
  };

  return (
    <div className="relative flex flex-col md:flex-row space-x-0 md:space-x-1 space-y-1 md:space-y-0 mb-1 md:mb-0">
      <div className="w-full md:w-3/4">
        <div
          className="relative"
          style={{
            paddingTop: "52.35%",
          }}
        >
          <div
            className={cx(
              "absolute inset-0 overflow-hidden rounded-none md:rounded-lg lg:rounded-xl",
              {
                hidden: hoverItem,
                "inline-block": !hoverItem,
              }
            )}
          >
            <DotCarousel slides={banners} />
          </div>

          <div
            className={cx(
              "bg-white absolute inset-0 w-full rounded-none md:rounded-lg lg:rounded-xl shadow-dark",
              {
                hidden: !hoverItem,
                "inline-block": hoverItem,
              }
            )}
            onMouseEnter={() => handleMouseEnter(hoverItem)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={cx(
                "rounded-xl px-8 py-4",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
              )}
            >
              <h3 className="text-2xl text-slate-600">
                {hoverItem && hoverItem.title}
              </h3>
              <hr className="border-b-1 border-gray-200 mt-2 mb-6" />
              <ul className="grid grid-cols-3 gap-4">
                {hoverItem &&
                  hoverItem.childrens.map((child: any) => (
                    <li
                      key={child.id}
                      className="relative rounded-md col-span-1"
                    >
                      <a
                        href="#"
                        className={cx(
                          "text-slate-600 text-lg hover:text-primary"
                        )}
                      >
                        {child.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <HeroMunu menus={menus} />
    </div>
  );
};

export default HeroCategory;

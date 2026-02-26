import React, { useState, useEffect, useCallback } from "react";
// import { DotButton, PrevButton, NextButton } from "./EmblaCarouselButtons";
import useEmblaCarousel from "embla-carousel-react";
import cx from "classnames";
import Autoplay from "embla-carousel-autoplay";
import { ComponentSharedBanner, Maybe } from "@lib/@generated/graphql";
import Image from "next/image";
import Link from "next/link";

interface DotCarouselProps {
  slides: Maybe<Array<Maybe<ComponentSharedBanner>>>;
}
export const DotCarousel: React.FC<DotCarouselProps> = ({ slides }) => {
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false }, [
    Autoplay(),
  ]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  return (
    <>
      <div className="relative">
        <div className="w-full overflow-hidden" ref={viewportRef}>
          <div className="flex relative">
            {slides?.map((item, index) => (
              <Link
                href={item?.link || "#"}
                key={index}
                id={item?.tagId || item?.id}
                target={item?.target || "_blank"}
                className="relative min-w-full"
              >
                <Image
                  src={item?.image.data?.attributes?.url || ""}
                  width={1910}
                  height={1000}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 480px) 480px, 960px"
                  style={{ objectFit: "cover" }}
                  alt={item?.image.data?.attributes?.alternativeText || ""}
                />
              </Link>
            ))}
          </div>
        </div>
        {/* <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} /> */}
        <div className="absolute bottom-3 z-10 w-full mx-auto left-0 right-0">
          <div className="flex justify-center space-x-2">
            {scrollSnaps.map((_, index) => (
              // <DotButton
              //   key={index}
              //   selected={index === selectedIndex}
              //   onClick={() => scrollTo(index)}
              // />
              <button
                className={cx(
                  "w-[8px] h-[8px] md:w-[12px] md:h-[12px] opacity-80 rounded-full",
                  {
                    "bg-gray-100": index !== selectedIndex,
                    "bg-primary": index === selectedIndex,
                  }
                )}
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

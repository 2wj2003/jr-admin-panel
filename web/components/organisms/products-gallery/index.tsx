"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export interface ProductGalleryProps {
  urls: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ urls }) => {
  const [emblaRef, embla] = useEmblaCarousel({
    containScroll: "keepSnaps",
    align: "start",
    // aligns the first slide to the start
    // of the viewport else will align it to the middle.

    loop: false,
    // we need the carousel to loop to the
    // first slide once it reaches the last slide.

    skipSnaps: false,
    // Allow the carousel to skip scroll snaps if
    // it's dragged vigorously.

    inViewThreshold: 0.7,
    // percentage of a slide that need's to be visible
    // inorder to be considered in view, 0.7 is 70%.
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // this function allow's us to scroll to the slide whose
  // id correspond's to the id of the navigation dot when we
  // click on it.

  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  );

  // set the id of the current slide to active id
  // we need it to correctly highlight it's corresponding
  // navigation dot.

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  // make sure embla is mounted and return true operation's
  // can be only performed on it if it's successfully mounted.

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-none md:rounded-lg border-0 md:border md:border-gray-200">
        <Image
          src={urls[selectedIndex]}
          width={1200}
          height={1200}
          loading="eager"
          // placeholder="blur"
          // layout="responsive"
          // objectFit="cover"
          priority={true}
          sizes="(max-width: 640px) 320px, 640px"
          alt=""
          className="aspect-square object-cover"
        />
      </div>
      <div className="overflow-hidden mt-1" ref={emblaRef}>
        <div className="flex">
          {urls.map((url, idx) => (
            <div
              className="relative flex-[0_0_30%]  p-[2px]"
              onClick={() => setSelectedIndex(idx)}
              key={url}
            >
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={url}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  alt=""
                  className="aspect-square object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

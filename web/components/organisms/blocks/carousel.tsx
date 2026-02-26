import useEmblaCarousel from 'embla-carousel-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { ComponentSharedCarousel } from '@lib/@generated/graphql';
import { getCard } from './utils/get-card';
import { getProps } from './utils/get-props';
import { getTransfromer } from './utils/get-transformer';
import { CTAButton } from './cta-button';
import Banner from './banner';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export interface CarouselProps extends ComponentSharedCarousel {}

export const Carousel: React.FC<CarouselProps> = ({
  id,
  bgColor,
  type,
  showMore,
  banner,
  ...props
}) => {
  const [emblaRef, embla] = useEmblaCarousel({
    containScroll:'trimSnaps',
    axis: 'x',
    align: 'start',
    loop: false,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: type === 'blogs' ? 4 :  5,
    dragFree: true
  });

  const { ItemComponent, items, transformer } = useMemo(() => {
    return {
      ItemComponent: getCard(type),
      items: getProps(type, props),
      transformer: getTransfromer(type)
    };
  }, [type, props]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  if (!ItemComponent) {
    return <div className="hidden" id="carousel-fallback" />;
  }

  return (
    <section
      id={'carousel-' + type + '-' + id}
      className={cx('flex flex-col space-y-4 w-full bg-white my-4', {
        'bg-yellow-300': bgColor === 'yellow',
        'bg-primary-500': bgColor === 'primary'
      })}
    >
      <div className="flex flex-row relative">
        {!!banner && (
          <Banner
            {...banner}
            className="hidden md:block relative w-1/4 items-center justify-center"
          />
        )}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex ml-1 md:ml-0 items-center">
            {items.map((item: any, idx: number) => (
              <div
                className={cx('relative p-[4px]', {
                  'flex-[0_0_45%] md:flex-[0_0_25%]':
                    !!banner && type !== 'blogs',
                  'flex-[0_0_45%] md:flex-[0_0_25%] lg:flex-[0_0_20%]':
                    !banner && type !== 'blogs',
                  'flex-[0_0_90%] md:flex-[0_0_33%] lg:flex-[0_0_33%]':
                    type === 'testimonials',
                  'flex-[0_0_90%] md:flex-[0_0_25%] ': type === 'blogs'
                })}
                key={idx}
              >
                <ItemComponent
                  imageUrl={''}
                  name={''}
                  slug={''}
                  originalPrice={0}
                  title={''}
                  publishedAt={''}
                  ImageAlternativeText={''}
                  {...transformer(item)}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="previous"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={
            cx('text-slate-600 text-xl bg-white border border-gray-200 rounded-full p-2 shadow-normal hover:shadow-dark absolute top-1/2 -translate-y-1/2 z-10 -left-12', {
              'hidden md:inline-block': prevBtnEnabled,
              'hidden': !prevBtnEnabled
            })
          }
        >
          <HiChevronLeft />
        </button>
        <button
          type="button"
          aria-label="next"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={
            cx('text-slate-600 text-xl bg-white border border-gray-200 rounded-full p-2 shadow-normal hover:shadow-dark absolute top-1/2 -translate-y-1/2 z-10 -right-12', {
              'hidden md:inline-block': nextBtnEnabled,
              'hidden md:hidden': !nextBtnEnabled
            })
          }
        >
          <HiChevronRight />
        </button>
      </div>

      {!!showMore && (
        <div className="py-4 text-center px-4">
          <CTAButton
            {...showMore}
            className="w-full max-w-[400px] mx-auto rounded-full text-lg font-medium"
          />
        </div>
      )}
    </section>
  );
};

export default Carousel;

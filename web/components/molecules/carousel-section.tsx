import useEmblaCarousel from 'embla-carousel-react';
import React, { useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import cx from 'classnames';
interface ItemProps {
  [key: string]: any;
}

export interface CarouselSectionProps {
  title?: string;
  description?: string;
  items: ItemProps[];
  itemComponent: React.ComponentType<any>;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  description,
  items,
  itemComponent
}) => {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7
  });

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const ItemComponent = itemComponent;

  return (
    <section className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between mt-4 md:mt-8">
        {!!title && (
          <div className="flex flex-col md:px-0">
            {title && (
              <h2 className="text-slate-600 font-medium text-2xl my-auto font-sans mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base font-normal text-gray-secondary line-clamp-1">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="hidden md:inline-block">
          <div className="ml-auto flex flex-row space-x-2">
            <button
              type="button"
              aria-label="previous"
              onClick={scrollPrev}
              className="text-slate-600 border border-gray-200 rounded-full p-2 shadow-normal hover:shadow-dark"
            >
              <HiChevronLeft />
            </button>
            <button
              type="button"
              aria-label="next"
              onClick={scrollNext}
              className="text-slate-600 border border-gray-200 rounded-full p-2 shadow-normal hover:shadow-dark"
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden mt-2" ref={emblaRef}>
        <div className="flex ml-1 md:ml-0">
          {[...items,...items,...items].map((item, idx) => (
            <div
              className={cx(
                'relative p-[4px] flex-[0_0_45%] md:flex-[0_0_25%]'
              )}
              key={idx}
            >
              <ItemComponent {...item} />
            </div>
          ))}
        </div>
      </div>
      <div className="py-4 text-center">
        <button className="text-lg font-medium text-slate-600 px-8 py-2 min-w-64 border border-gray-300 rounded-full cursor-pointer hover:shadow-normal hover:border-primary-500 bg-white">
          แสดงทั้งหมด
        </button>
      </div>
    </section>
  );
};

export default CarouselSection;

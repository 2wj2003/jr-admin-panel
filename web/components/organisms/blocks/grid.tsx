import { ComponentSharedGrid } from '@lib/@generated/graphql';
import { useMemo } from 'react';
import { getCard } from './utils/get-card';
import { getProps } from './utils/get-props';
import { getTransfromer } from './utils/get-transformer';
import cx from 'classnames';
import { CTAButton } from './cta-button';

interface GridProps extends ComponentSharedGrid {}
export const Grid: React.FC<GridProps> = ({
  id,
  bgColor,
  type,
  showMore,
  column,
  ...props
}) => {
  const { ItemComponent, items, transformer } = useMemo(() => {
    return {
      ItemComponent: getCard(type),
      items: getProps(type, props),
      transformer: getTransfromer(type)
    };
  }, [type, props]);

  if (!ItemComponent) {
    return <div className="hidden" id="grid-fallback" />;
  }

  return (
    <section
      id={'carousel-' + id}
      className={cx('flex flex-col w-full bg-white mb-0', {
        'bg-yellow-300': bgColor === 'yellow',
        'bg-primary-500': bgColor === 'primary',
        'my-4': type !== 'banners'
      })}
    >
      <div
        className={cx({
          'grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 px-2 md:px-0': type === 'products',
          'grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-2 md:px-0': type === 'showcases' || type === 'blogs',
          'grid grid-cols-1':  type === 'banners' && column === 1,
          'grid grid-cols-2':  type === 'banners' && column === 2,
          'grid grid-cols-3':  type === 'banners' && column === 3,
        })}
      >
        {items.map((item: any, idx: number) => (
          <div className="col-span-1" key={idx}>
            <ItemComponent
              id={''}
              image={{
                __typename: undefined,
                data: undefined
              }}
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
      {!!showMore && (
        <div className="py-4 text-center px-4 mt-4">
          <CTAButton
            {...showMore}
            className="w-full max-w-[400px] mx-auto rounded-full text-lg font-medium"
          />
        </div>
      )}
    </section>
  );
};

export default Grid;

import { ComponentSharedSection } from '@lib/@generated/graphql';
import cx from 'classnames';
export interface SectionProps extends ComponentSharedSection {}

export const Section: React.FC<SectionProps> = ({
  id,
  bgColor,
  title,
  description,
  align,
  preTitle
}) => {
  return (
    <section
      id={'section-' + id}
      className={cx('flex flex-col space-y-4 w-full bg-white', {
        'bg-yellow-300': bgColor === 'yellow',
        'bg-primary-500': bgColor === 'primary',
        'bg-gray-100': bgColor === 'gray'
      })}
    >
      <div
        className={cx('flex w-full mt-4 md:mt-8', {
          ' justify-start': align === 'right',
          'justify-center': align === 'center',
          'justify-end': align === 'right'
        })}
      >
        {!!title && (
          <div className="flex flex-col px-2 md:px-0">
            {!!preTitle && (
              <div
                className={cx('text-lg text-primary', {
                  'text-center': align === 'center'
                })}
              >
                {preTitle}
              </div>
            )}
            {title && (
              <h2
                className={cx(
                  'text-slate-900 font-medium text-xl md:text-2xl my-auto font-sans mb-1',
                  {
                    'text-center': align === 'center'
                  }
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <div
                className={cx(
                  'w-full max-w-lg text-gray-secondary whitespace-pre-wrap font-body prose prose-lg prose-p:m-0',
                  {
                    'text-center': align === 'center'
                  }
                )}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: description
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Section;

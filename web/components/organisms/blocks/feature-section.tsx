import { ComponentSharedFeatureSection } from '@lib/@generated/graphql';
import cx from 'classnames';
import { FeatureItem } from '../feature-item';

interface FeatureSectionProps extends ComponentSharedFeatureSection {}
export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  features
}) => {
  return (
    <section className="bg-gray-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 my-0 md:my-4  py-12 rounded-lg flex flex-col gap-12">
        <div className="flex w-full justify-center">
          <div className="flex flex-col md:px-0">
            <h2 className="text-primary font-medium text-xl md:text-xl my-auto font-sans mb-1 text-center">
              {title}
            </h2>

            <div className="w-full max-w-lg text-gray-secondary whitespace-pre-wrap font-body prose prose-lg prose-p:m-0 text-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: description || ''
                }}
              />
            </div>
          </div>
        </div>
        <div className={cx('grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2')}>
          {features?.map((f, idx) => (
            <FeatureItem
              key={f?.id || idx}
              title={f?.title}
              description={f?.description}
              image={f?.image}
              id={f?.id || `${idx}`}
              __typename={f?.__typename}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


export default FeatureSection
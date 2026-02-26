import Image from 'next/image';
import { ComponentSharedFeature } from '@lib/@generated/graphql';

interface FeatureItemProps extends ComponentSharedFeature {}
export const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
  image
}) => {
  return (
    <div className="flex flex-row gap-4 bg-white rounded-lg px-4 py-4 shadow-normal items-center">
      <div>
        <Image
          src={image?.data?.attributes?.url || ''}
          width="50"
          height="50"
          layout="fixed"
          loading="lazy"
          className="rounded-lg overflow-hidden"
          alt=''
        />
      </div>
      <div>
        <h3 className="flex items-center mb-1 text-xl font-medium text-primary">
          {title}
        </h3>
        <div className="w-full max-w-lg text-gray-secondary whitespace-pre-wrap font-body prose prose-lg prose-p:m-0">
          <div
            dangerouslySetInnerHTML={{
              __html: description || ''
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;

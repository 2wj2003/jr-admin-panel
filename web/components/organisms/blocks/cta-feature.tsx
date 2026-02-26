import Image from 'next/image';
import {
  ComponentSharedButton,
  ComponentSharedCtaFeature
} from '@lib/@generated/graphql';
import { CTAButton } from './cta-button';

export interface CTAFeatureProps extends ComponentSharedCtaFeature {}

export const CTAFeature: React.FC<CTAFeatureProps> = ({
  title,
  image,
  imagePosition,
  description,
  preTitle,
  ctas
}) => (
  <div className="overflow-hidden container mx-auto px-0 md:px-8 lg:px-16">
    <div className="my-4 md:my-8">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-1 items-center justify-center w-full md:w-1/2">
          <div className="relative w-full">
            <Image
              src={image?.data?.attributes?.url || ''}
              width={image?.data?.attributes?.width || '300'}
              height={image?.data?.attributes?.height || '400'}
              loading="lazy"
              layout="responsive"
              // placeholder="blur"
              objectFit="cover"
              alt={image?.data?.attributes?.alternativeText || ''}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4 md:p-8  w-full md:w-1/2">
          {!!preTitle && <div className="text-lg text-primary">{preTitle}</div>}
          <h2 className="text-3xl md:text-4xl text-slate-600 font-medium text-left">
            {title}
          </h2>
          <div className="w-full text-gray-secondary whitespace-pre-wrap font-body prose max-w-full">
            {description && (
              <div
                dangerouslySetInnerHTML={{
                  __html: description || ''
                }}
              />
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 my-8 flex-wrap">
            {ctas?.map((cta, idx) => (
              <CTAButton {...(cta as ComponentSharedButton)} key={idx} className="rounded-lg px-12" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CTAFeature;

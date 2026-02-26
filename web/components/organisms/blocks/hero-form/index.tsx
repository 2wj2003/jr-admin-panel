import Image from 'next/image';
import { ComponentSharedHeroForm } from '@lib/@generated/graphql';
import { Form } from './form';
import cx from 'classnames';

interface HeroFormProps extends ComponentSharedHeroForm {}

export const HeroForm: React.FC<HeroFormProps> = ({
  image,
  formTitle,
  background
}) => (
  <div
    className={cx({
      'bg-primary': background === 'primary',
      'bg-white': background === 'white'
    })}
  >
    <div className="container mx-auto px-0 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row pt-4 md:pt-12 pb-12 gap-6 px-4 md:px-0">
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full">
            <Image
              src={image.data?.attributes?.url || ''}
              width={image.data?.attributes?.width || 1200}
              height={image.data?.attributes?.height || 630}
              alt={image.data?.attributes?.alternativeText || 'hero-form'}
              loading="eager"
              layout="responsive"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex w-full md:w-[350px]">
          <div className="block">
            <Form title={formTitle} background={background} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroForm;

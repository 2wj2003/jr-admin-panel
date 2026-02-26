import Image from 'next/image';
import { ComponentSharedBanner } from '@lib/@generated/graphql';
import Link from 'next/link';

export interface BannerProps extends ComponentSharedBanner {
  className?: string;
}
export const Banner: React.FC<BannerProps> = ({
  link,
  id,
  image,
  tagId,
  target,
  className
}) => {
  return (
    (<Link
      href={link || '#'}
      id={tagId || id}
      target={target || '_blank'}
      className={className}>

      <Image
        src={image?.data?.attributes?.url || ''}
        width={image.data?.attributes?.width || 100}
        height={image.data?.attributes?.height || 100}
        layout="responsive"
        loading="lazy"
        objectFit="cover"
        // placeholder="blur"
        alt={image.data?.attributes?.alternativeText || 'banner' + id}
      />

    </Link>)
  );
};

export default Banner;

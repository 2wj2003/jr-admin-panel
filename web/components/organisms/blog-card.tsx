import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
var buddhistEra = require('dayjs/plugin/buddhistEra');
require('dayjs/locale/th');
dayjs.extend(buddhistEra);
dayjs.locale('th');

export interface BlogCardProps {
  title: string;

  slug: string;

  publishedAt: string;

  imageUrl: string;
  ImageAlternativeText: string;

  description: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  publishedAt,
  imageUrl,
  description
}) => {
  return (
    <Link href={`/blogs/${slug}`}>
      <div className="bg-white overflow-hidden rounded-lg border border-gray-100 cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out hover:shadow-light">
        <div className="relative">
          <Image
            src={imageUrl}
            width={1200}
            height={630}
            layout="responsive"
            loading="lazy"
            objectFit="cover"
            alt={title}
            // placeholder="blur"
          />
        </div>
        <div className="flex flex-col space-y-2 px-2 md:px-4 py-4">
          <span className="text-xs text-gray-secondary">
            {dayjs(publishedAt).format("DD MMMM BB")}
          </span>
          <h3 className="text-base text-gray-primary font-medium">
            <span className="line-clamp-2 ">{title}</span>
          </h3>
          <p className="flex flex-row space-x-2 flex-wrap text-gray-secondary text-sm line-clamp-3 h-[3.75rem]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

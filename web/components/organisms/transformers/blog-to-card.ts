import { BlogCardProps } from '@components/organisms/blog-card';
import { BlogEntity } from './../../../lib/@generated/graphql';

export const BlogToCard = (blog: BlogEntity): BlogCardProps => {
  return {
    title: blog.attributes?.title || '',

    slug: blog.attributes?.slug || '',
    description: blog.attributes?.description || '',

    publishedAt: blog.attributes?.publishedAt,

    imageUrl: blog.attributes?.coverImage?.data?.attributes?.url || '',
    ImageAlternativeText:
      blog.attributes?.coverImage?.data?.attributes?.alternativeText || ''
  };
};

export default BlogToCard;

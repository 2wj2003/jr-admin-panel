import { ComponentSharedSeo, Maybe } from '@lib/@generated/graphql';
import Head from 'next/head';

const defaultSeo: ComponentSharedSeo = {
  id: '',
  metaDescription: 'jr.co.th',
  metaTitle: 'jr.co.th',
  metaImage: {
    data: {
      attributes: {
        name: 'jr.co.th',
        mime: 'image/jpeg',
        provider: 'aws',
        hash: '',
        size: 0,
        url: 'https://s3.ap-southeast-1.amazonaws.com/jr.co.th/LINE_ALBUM_220620_0_56b4bdde05.jpg'
      }
    }
  }
};

export interface ISeo {
  seo:  Maybe<ComponentSharedSeo> | undefined;
}

export const Seo: React.FunctionComponent<ISeo> = ({ seo }) => {
  const seoWithDefaults = {
    ...defaultSeo,
    ...seo
  };
  const fullSeo = {
    ...seoWithDefaults,
    // Add title suffix
    metaTitle: `${seoWithDefaults.metaTitle} | jr.co.th`
    // Get full image URL
    // shareImage: getStrapiMedia(seoWithDefaults.shareImage),
  };

  return (
    <Head>
      {fullSeo.metaTitle && (
        <>
          <title>{fullSeo.metaTitle}</title>
          <meta property="og:title" content={fullSeo.metaTitle} />
          <meta name="twitter:title" content={fullSeo.metaTitle} />
        </>
      )}
      {fullSeo.metaDescription && (
        <>
          <meta name="description" content={fullSeo.metaDescription} />
          <meta property="og:description" content={fullSeo.metaDescription} />
          <meta name="twitter:description" content={fullSeo.metaDescription} />
        </>
      )}
      {fullSeo.metaImage.data?.attributes?.url && (
        <>
          <meta property="og:image" content={fullSeo.metaImage.data?.attributes?.url} />
          <meta name="twitter:image" content={fullSeo.metaImage.data?.attributes?.url} />
          <meta name="image" content={fullSeo.metaImage.data?.attributes?.url} />
        </>
      )}
    </Head>
  );
};

export const imageFields = [
  "id",
  "name",
  "url",
  "width",
  "height",
  "alternativeText",
  "caption",
];

export const blocks = {
  populate: {
    products: {
      fields: ["id", "name", "slug", "sku", "discountPrice", "originalPrice"],
      populate: {
        coverImage: {
          fields: imageFields,
        },
      },
    },
    image: {
      fields: imageFields,
    },
    showMore: {
      populate: "*",
    },
    banner: {
      populate: {
        image: {
          fields: imageFields,
        },
      },
    },
    timeline: {
      populate: "*",
    },
    ctas: {
      populate: "*",
    },
    showcases: {
      fields: ["id", "title", "slug"],
      populate: {
        cover: {
          fields: imageFields,
        },
      },
    },
    blogs: {
      fields: ["id", "title", "slug" ,"description", "publishedAt"],
      populate: {
        coverImage: {
          fields: imageFields,
        },
      },
    },
    banners: {
      populate: "*",
    },
    items: {
      fields: imageFields,
    },
    faq: {
      populate: "*",
    },
    testimonials: {
      populate: "*",
    },
    testimonial: {
      populate: "*",
    },
    features: {
      populate: "*",
    }
  },
};

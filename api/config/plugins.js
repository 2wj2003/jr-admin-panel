const transformCategory = (entry) => {
  const hierarchicalCategories = {};
  const categories = [];

  if (entry?.category) {
    const parentName = entry?.category?.parent?.name;

    const categoryName = entry?.category.name;

    if (parentName) {
      hierarchicalCategories["lvl0"] = parentName;
      hierarchicalCategories["lvl1"] = parentName + " > " + categoryName;

      categories.push(parentName);
      categories.push(categoryName);
    } else {
      if (categoryName) {
        hierarchicalCategories["lvl0"] = categoryName;
        categories.push(categoryName);
      }
    }
  }

  return { hierarchicalCategories, categories };
};

module.exports = ({ env, strapi }) => ({
  "config-sync": {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      importOnBootstrap: true,
      customTypes: [],
      excludedTypes: [],
      excludedConfig: [],
    },
  },
  seo: {
    enabled: true,
  },
  "import-export-entries": {
    enabled: true,
  },
  bulkoperator: {
    enabled: true,
    resolve: "strapi-bulk-operator",
  },
  sitemap: {
    enabled: true,
    config: {
      autoGenerate: true,
      allowedFields: ["id", "slug"],
      excludedTypes: [],
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "pongnares@venuee.co",
      },
    },
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::product.product",
          modelName: "product",
          transliterate: false,
          queryConstraints: {
            fields: ['id', 'name', 'slug'],
            where: {
              $and: [
                {
                  publishedAt: { $notNull: true },
                },
              ],
            },
          },
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -600,
            limit: 10,
            keys: [
              {
                name: "name",
                weight: 100,
              },
              {
                name: "description",
                weight: -100,
              },
            ],
          },
        },
      ],
    },
  },
  menus: {
    config: {
      maxDepth: 3,
      // layouts: {
      //   menuItem: {
      //     link: [
      //       {
      //         input: {
      //           label: 'url',
      //           name: 'url',
      //           type: 'text',
      //         },
      //         grid: {
      //           col: 6,
      //         },
      //       },
      //     ],
      //   },
      // },
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
      },
    },
  },
  ezforms: {
    config: {
      captchaProvider: {
        name: "none",
      },
      notificationProviders: [
        {
          name: "email",
          enabled: true,
          config: {
            from: "pongnares@venuee.co",
          },
        },
      ],
    },
  },
  meilisearch: {
    config: {
      host: env("MEILI_HOST"),
      apiKey: env("MEILI_MASTER_KEY"),
      category: {
        settings: {
          filterableAttributes: ["parent", "name"],
        },
      },
      blog: {
        settings: {
          filterableAttributes: [
            "brands",
            "category",
            "categories",
            "hierarchicalCategories",
          ],
        },
        populateEntryRule: {
          seo: true,
          coverImage: true,
          category: {
            populate: ["parent"],
          },
        },
        transformEntry({ entry }) {
          const { hierarchicalCategories, categories } =
            transformCategory(entry);

          delete entry?.coverImage?.formats;
          delete entry?.blocks;
          delete entry?.category;

          return {
            ...entry,
            hierarchicalCategories,
            categories,
          };
        },
      },
      product: {
        settings: {
          filterableAttributes: [
            "brands",
            "category",
            "originalPrice",
            "categories",
            "hierarchicalCategories",
            "name",
            "warrantyDuration",
            "instalment",
          ],
        },
        populateEntryRule: {
          brands: true,
          coverImage: true,
          category: {
            populate: ["parent"],
          },
        },
        transformEntry({ entry }) {
          const { hierarchicalCategories, categories } =
            transformCategory(entry);

          delete entry?.coverImage?.formats;

          return {
            id: entry.id,
            name: entry.name,
            slug: entry.slug,
            sku: entry.sku,
            originalPrice: entry.originalPrice,
            discountPrice: entry.discountPrice,
            coverImage: entry.coverImage,
            hierarchicalCategories,
            categories,
            brands: entry?.brands?.map((brand) => brand.name),
          };
        },
      },
    },
  },
  "preview-button": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::product.product",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "products",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/products/{slug}",
          },
        },
        {
          uid: "api::category.category",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "categories",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/categories/{slug}",
          },
        },
        {
          uid: "api::brand.brand",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "brands",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/brands/{slug}",
          },
        },
        {
          uid: "api::showcase.showcase",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "showcase",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/showcase/{slug}",
          },
        },
        {
          uid: "api::homepage.homepage",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "",
              slug: "",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th",
          },
        },
        {
          uid: "api::page.page",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/{slug}",
          },
        },
        {
          uid: "api::blog.blog",
          draft: {
            url: "https://jr.co.th/api/draft",
            query: {
              path: "blogs",
              slug: "{slug}",
              secret: env("STRAPI_PREVIEW_SECRET"),
            },
          },
          published: {
            url: "https://jr.co.th/blogs/{slug}",
          },
        },
      ],
    },
  },
  ckeditor: {
    enabled: true,
    config: {
      plugin: {
        // disable data-theme tag setting //
        // setAttribute:false,
        // disable strapi theme, will use default ckeditor theme //
        // strapiTheme:false,
        // styles applied to editor container (global scope) //
        // styles:`
        // :root{
        //   --ck-color-focus-border:red;
        //   --ck-color-text:red;
        // }
        // `
      },
      editor: {
        // editor default config

        // https://ckeditor.com/docs/ckeditor5/latest/features/markdown.html
        // if you need markdown support and output set: removePlugins: [''],
        // default is
        removePlugins: ["Markdown"],

        // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "|",
            "StrapiMediaLib",
            "mediaEmbed",
            "insertTable",
            "fullScreen",
            "undo",
            "redo",
          ],
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/images/images-overview.html
        image: {
          resizeUnit: "%",
          resizeOptions: [
            {
              name: "resizeImage:original",
              value: null,
              icon: "original",
            },
            {
              name: "resizeImage:25",
              value: "25",
              icon: "small",
            },
            {
              name: "resizeImage:50",
              value: "50",
              icon: "medium",
            },
            {
              name: "resizeImage:75",
              value: "75",
              icon: "large",
            },
          ],
          toolbar: [
            "toggleImageCaption",
            "imageTextAlternative",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "linkImage",
            "resizeImage:25",
            "resizeImage:50",
            "resizeImage:75",
            "resizeImage:original",
          ],
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/table.html
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableCellProperties",
            "tableProperties",
            "toggleTableCaption",
          ],
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
          ],
        },
        mediaEmbed: {
          previewsInData: true,
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html
        htmlSupport: {
          allow: [
            {
              name: "img",
              attributes: {
                sizes: true,
                loading: true,
              },
            },
          ],
        },
      },
    },
  },
});

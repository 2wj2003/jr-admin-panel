import { CategoryEntityResponseCollection } from "@lib/@generated/graphql";
import { fetcher } from "@lib/api/fetcher";
import { getApiUrl } from "@lib/api/get-url";
const qs = require("qs");

const allCategories = () => {
  const apiUrl = getApiUrl();

  const query = qs.stringify(
    {
      populate: {
        parent: {
          fields: ["id", "slug"],
        },
        categories: {
          fields: ["id", "name", "slug"],
          populate: {
            categories: {
              fields: ["id", "name", "slug"],
              populate: {
                categories: true,
              },
            },
          },
        },
      },
      fields: ["name", "slug"],
      pagination: {
        pageSize: 100,
      },
    },
    { encodeValuesOnly: true }
  );

  return `${apiUrl}/api/categories?${query}`;
};

export default async function Tree() {
  const categoiesKey = allCategories();

  const categoies = await fetcher<CategoryEntityResponseCollection>(
    categoiesKey
  ).then((c) => c.data?.filter((f) => !f.attributes?.parent?.data));

  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col gap-4">
        {categoies.map((v1) => (
          <div key={v1.id}>
            <div>
              level-1: {v1.attributes?.name} - ({v1.attributes?.slug})
            </div>
            <div className="ml-12 flex flex-col gap-4">
              {v1.attributes?.categories?.data.map((v2) => (
                <div key={v2.id}>
                  <div>
                    v2-------{v2.attributes?.name} - ({v2.attributes?.slug})
                  </div>
                  <div className="ml-12 flex flex-col gap-4">
                    {v2.attributes?.categories?.data.map((v3) => (
                      <div key={v3.id}>
                        <div>v3-------{v3.attributes?.name}</div>
                        <div className="ml-12 flex flex-col gap-4">
                          {v3.attributes?.categories?.data.map((v4) => (
                            <div key={v4.id}>
                              <div>v4-------{v4.attributes?.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

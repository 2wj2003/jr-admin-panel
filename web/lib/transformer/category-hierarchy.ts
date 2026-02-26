import { CategoryEntity, Maybe } from "@lib/@generated/graphql";

interface Breadcrumb {
  name: string;
  path: string;
}

interface BreadcrumbItem {
  path: string;
  name: string;
  slug: string
}

export interface CategoryEntityWithPath extends CategoryEntity {
  path?: string;
  parentId?: string;
}

export const transformToHierarchy = (
  categories: CategoryEntityWithPath[]
): CategoryEntityWithPath[] => {
  const transformedCategories = [
    ...categories.map((c) => ({
      ...c,
      parentId: c.attributes?.parent?.data?.id || "",
    })),
  ];

  for (let i = 0; i < transformedCategories.length; i++) {
    const category = transformedCategories[i];
    let parentId = category.parentId;
    category.path = category.attributes?.slug;
    let level = 0;

    while (parentId && level < 4) {
      const parent = transformedCategories.find((c) => c.id === parentId);
      category.path = parent?.attributes?.slug + "/" + category.path;
      parentId = parent?.parentId || "";

      level++;
    }
  }

  return transformedCategories;
};

export const generateBreadcrumb = (
  transformedCategories: CategoryEntityWithPath[],
  slug?: string
): BreadcrumbItem[] => {
  const breadcrumb: BreadcrumbItem[] = [];
  let currentCategory = transformedCategories.find(
    (category) => category?.attributes?.slug === slug
  );

  while (currentCategory) {
    breadcrumb.unshift({
      path: currentCategory.path || "",
      name: currentCategory?.attributes?.name || "",
      slug: currentCategory?.attributes?.slug || "",
    });

    currentCategory = transformedCategories.find(
      (category) =>
        category.id === currentCategory?.attributes?.parent?.data?.id
    );
  }

  return breadcrumb;
};

export interface FlatCategory extends CategoryEntityWithPath {
  children: CategoryEntityWithPath[];
}

export const flattenCategories = (
  categories: CategoryEntityWithPath[]
): FlatCategory[] => {
  const roots = categories.filter((c) => !c.parentId);

  return roots.map((r) => ({
    ...r,
    children: categories.filter((c) => c.path?.startsWith(r.attributes?.slug || "/") && c.id != r.id),
  }));
};

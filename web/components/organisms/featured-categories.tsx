import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

interface FeaturedCategory {
  id: number;
  attributes: {
    title: string;
    order: number;
    description: string;
    isActive: boolean;
    image?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    category?: {
      data?: {
        attributes?: {
          slug: string;
          name: string;
        };
      };
    };
  };
}

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const activeCategories = categories
    .filter((cat) => cat.attributes.isActive)
    .sort((a, b) => a.attributes.order - b.attributes.order)
    .slice(0, 6);

  if (activeCategories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-10 my-8 md:my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-900 font-medium text-xl md:text-2xl font-sans">
          หมวดหมู่สินค้ายอดนิยม
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activeCategories.map((cat) => {
          const categorySlug = cat.attributes.category?.data?.attributes?.slug;
          const href = categorySlug ? `/category/${categorySlug}` : "#";
          
          return (
            <Link
              key={cat.id}
              href={href}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {cat.attributes.title}
                    </h3>
                  </div>
                  <HiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
                
                {cat.attributes.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {cat.attributes.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                  <span>ดูสินค้าทั้งหมด</span>
                  <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

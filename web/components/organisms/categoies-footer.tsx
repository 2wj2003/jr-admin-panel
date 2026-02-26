import Link from "next/link";
import { FlatCategory } from "@lib/transformer/category-hierarchy";

interface Props {
  categories?: FlatCategory[];
}

export const FooterCategoies: React.FC<Props> = ({ categories = [] }) => (
  <div className="bg-slate-100 py-6 font-sans">
    <div className="overflow-hidden container mx-auto px-4 md:px-8 lg:px-10">
      <div className="text-slate-900 font-medium text-base font-sans mb-2">
        ประเภทสินค้าทั้งหมด
      </div>
      <ul className="list-none">
        {categories.map((ct) => (
          <li key={ct.id}>
            <Link
              href={`/categories/${ct.attributes?.slug}`}
              className="text-xs font-bold text-primary-500 hover:text-primary-600"
            >
              {ct.attributes?.name}
            </Link>
            <ul className="grid grid-flow-row-dense grid-cols-2 md:grid-cols-5 gap-1 mb-4 list-none">
              {ct.children.map((c) => (
                <li className="col-span-1" key={c.id}>
                  <Link
                    href={`/categories/${c.attributes?.slug}`}
                    className="text-xs font-normal text-primary-500 hover:text-primary-600"
                  >
                    {c.attributes?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

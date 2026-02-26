import { aboutMenus } from "@lib/consts/menu-links/about";
import { blogMenus } from "@lib/consts/menu-links/blog";
import { serviceMenus } from "@lib/consts/menu-links/service";
import { MenuLink } from "@lib/interfaces/menu-link";
import Link from "next/link";

interface MenuProps {
  items: MenuLink[];
  title: string;
}

const Menu: React.FC<MenuProps> = ({ items, title }) => {
  return (
    <div className="flex flex-col">
      <div className="text-base font-medium text-slate-900">{title}</div>
      <ul className="flex flex-col">
        {items.map((i) => (
          <li key={i.slug}>
            <Link
              href={i.slug}
              className="text-xs text-slate-600 hover:text-primary"
            >
              {i.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-white py-8">
      <div className="overflow-hidden container mx-auto px-4 md:px-8 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className="col-span-1">
            <Menu items={aboutMenus} title="JR.co.th" />
          </div>
          <div className="col-span-1">
            <Menu items={serviceMenus} title="แผนกบริการลูกค้า" />
          </div>
          <div className="col-span-1">
            <Menu items={blogMenus} title="รีวิวและบทความ" />
            {/* <Menu items={followMenus} title="ติดตามเรา" /> */}
          </div>
          <div className="col-span-1">
            <div className="text-base text-slate-900 font-medium">
              บริษัท เจ. อาร์. ออฟฟิต ออโตเมชั่น จำกัด
            </div>
            <div className="text-sm text-slate-600">
            464-496 ถนนสุทธิสารวินิจฉัย แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-primary-100">
        <div className="overflow-hidden container mx-auto px-0 md:px-8 lg:px-10">
          © Copyright 2022 jr.co All Rights Reserved.
        </div>
      </div> */}
    </footer>
  );
};

import { MenuLink } from '@lib/interfaces/menu-link';

export const blogMenus: MenuLink[] = [
  {
    title: 'บทความทั้งหมด',
    slug: 'blogs'
  },
  // {
  //   title: 'บทความ CCTV',
  //   slug: ''
  // },
  // {
  //   title: 'บทความ Autogate',
  //   slug: ''
  // },
  // {
  //   title: 'บทความ Solar',
  //   slug: ''
  // },
  {
    title: 'รีวิวผลงาน Solar',
    slug: '/showcases/cctv'
  },
  {
    title: 'รีวิวผลงาน Autogate',
    slug: '/showcases/autogate'
  },
  {
    title: 'รีวิวผลงาน Solar Rooftop',
    slug: '/showcases/'
  }
];

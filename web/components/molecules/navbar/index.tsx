import Link from "next/link";
import { BsTelephoneFill } from "react-icons/bs";
import Image from "next/image";
import { LineButton } from "@components/organisms/line-button";
import { Suspense } from "react";
import { SearchInput } from "@components/search/seach-input";

export interface NavbarProps {}

const Menu = () => (
  <ul className="flex flex-row divide-x divide-gray-300">
    <li className="my-auto">
      <Link
        href="/categories/cctv"
        className=" bg-transparent hover:text-primary items-center flex flex-row space-x-1 pr-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        กล้องวงจรปิด
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/categories/autogate"
        className=" bg-transparent hover:text-primary items-center flex flex-row space-x-1 px-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        ประตูอัตโนมัติ
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/categories/solar-cell"
        className=" bg-transparent hover:text-primary items-center flex flex-row space-x-1 px-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        โซล่าเซลล์
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/categories/wholesale"
        className=" bg-transparent hover:text-primary items-center flex flex-row space-x-1 px-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        สินค้าราคาส่ง
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/showcases"
        className="bg-transparent hover:text-primary items-center flex flex-row space-x-1 px-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        รีวิวการติดตั้ง
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/blogs"
        className="bg-transparent hover:text-primary items-center flex flex-row space-x-1 px-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        บทความ
      </Link>
    </li>
    <li className="my-auto">
      <Link
        href="/contact"
        className="bg-transparent hover:text-primary items-center flex flex-row space-x-1 pl-4 text-sm font-normal text-gray-secondary focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
      >
        ติดต่อเรา
      </Link>
    </li>
  </ul>
);

// const BurgerMenu = () => {
//   return (
//     <div className="-ml-2 mr-2 flex items-center md:hidden">
//       <button
//         type="button"
//         className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//         aria-controls="mobile-menu"
//         aria-expanded="false"
//       >
//         <span className="sr-only">main menu</span>
//         <svg
//           className="block h-6 w-6"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth="1.5"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//           />
//         </svg>
//         <svg
//           className="hidden h-6 w-6"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth="1.5"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M6 18L18 6M6 6l12 12"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="shadow-light bg-white fixed w-full block top-0 z-20">
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-2 md:px-8 lg:px-10 py-2 md:py-3">
          <div className="flex flex-row justify-between">
            <Link href="/" className="mr-4">
              <Image
                src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/thumbnail_jr_logo_58e887e661.png"
                width="50"
                height="50"
                alt="jr-logo"
                className="hidden sm:inline-block"
                priority
              />
              <Image
                src="https://s3.ap-southeast-1.amazonaws.com/jr.co.th/thumbnail_jr_logo_58e887e661.png"
                width="40"
                height="40"
                alt="jr-logo"
                className="inline-block sm:hidden"
                priority
              />
            </Link>
            <LineButton
              className="max-w-[200px] py-2 ml-auto inline-block sm:hidden"
              title="จองคิวติดตั้งด่วน"
            />
            <div className="hidden sm:inline-block w-full">
              <div className="hidden sm:grid sm:grid-cols-12">
                <div className="col-span-7">
                  <div className="flex flex-col gap-2">
                    <Suspense>
                      <SearchInput />
                    </Suspense>
                    <Menu />
                  </div>
                </div>
                <div className="col-span-5">
                  <a
                    href="tel:066-146-3289"
                    className="hidden md:inline-block text-primary hover:text-primary-600 px-1 py-2"
                  >
                    {/* <BsTelephoneFill className="inline-block mr-1" /> */}
                    <span className="inline-block my-auto">066-146-3289</span>
                  </a>
                  <a
                    href="tel:061-8879-879"
                    className="hidden md:inline-block text-primary hover:text-primary-600 px-1 py-2"
                  >
                    {/* <BsTelephoneFill className="inline-block mr-1" /> */}
                    <span className="inline-block my-auto">061-8879-879</span>
                  </a>
                  <LineButton
                    className="max-w-[200px] py-2"
                    title="จองคิวติดตั้งด่วน"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

"use client"

import { Disclosure } from "@headlessui/react";
import { HiChevronRight, HiOutlineClock } from "react-icons/hi";
import { Instalment } from "./molecules/instalment";

interface Props {
  instalment?: number;
}

export const InstalmentDisclosure: React.FC<Props> = ({ instalment }) => (
  <div className="block sm:hidden px-4 bg-white my-2">
    <Disclosure>
      <Disclosure.Button className="w-full py-4 text-left flex">
        <HiOutlineClock className="inline mr-4 text-gray-400" size="1.5rem" />
        <span className="font-medium text-base text-slate-600">
          ผ่อน 0% สูงสุด {instalment} เดือน
        </span>
        <HiChevronRight className="ml-auto text-gray-400" size="1.5rem" />
      </Disclosure.Button>
      <Disclosure.Panel className="text-gray-500">
        <Instalment instalment={instalment || 0} />
      </Disclosure.Panel>
    </Disclosure>
  </div>
);

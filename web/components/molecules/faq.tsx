"use client"

import { Disclosure } from "@headlessui/react";
import cx from "classnames";
import { HiOutlineChevronUp } from "react-icons/hi";

interface FaqProps {
  answer: string;
  question: string;
}

export const Faq: React.FC<FaqProps> = ({ answer, question }) => {


  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={cx(
              "flex w-full gap-1 justify-between bg-slate-100 px-6 pt-6 text-left text-lg text-slate-900 font-medium",
              {
                "rounded-lg pb-6": !open,
                "rounded-t-lg pb-2": open,
              }
            )}
          >
            <span>{question}?</span>
            <HiOutlineChevronUp
              className={cx("min-w-5 h-5 w-5 text-slate-600 flex-shrink-0", {
                "rotate-180 transform": open,
              })}
            />
          </Disclosure.Button>
  
          <Disclosure.Panel
            className={cx(
              "px-6 pt-2 pb-4 text-sm text-slate-600 bg-slate-100 rounded-b-lg font-body whitespace-pre-wrap"
            )}
            as="pre"
          >
            {answer}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

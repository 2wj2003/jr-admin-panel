"use client"

import { ComponentSharedFaqSection } from '@lib/@generated/graphql';
import cx from 'classnames';
import { Disclosure } from '@headlessui/react';
import { HiOutlineChevronUp } from 'react-icons/hi';
export interface FaqSectionProps extends ComponentSharedFaqSection {}
export const FaqSection: React.FC<FaqSectionProps> = ({
  id,
  items,
  bgColor
}) => {
  return (
    <section
      id={'faqs-' + id}
      className={cx('flex flex-col space-y-4 w-full bg-white', {
        'bg-gray-100': bgColor === 'gray',
        'bg-primary-500': bgColor === 'primary'
      })}
    >
      <ul className="py-12 px-2 md:px-12 flex flex-col space-y-2">
        {items?.map((i) => (
          <Disclosure key={i?.id}>
            {({ open }) => (
              <div>
                <Disclosure.Button
                  className={cx(
                    'flex w-full justify-between bg-white px-6 pt-6 text-left text-xl text-slate-600 font-medium',
                    {
                      'rounded-lg pb-6 border border-gray-200': !open,
                      'rounded-t-lg pb-2 border border-b-0 border-gray-200':
                        open
                    }
                  )}
                >
                  <span>Q: {i?.question}?</span>
                  <HiOutlineChevronUp
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-slate-600`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel
                  className={cx(
                    'px-6 pt-2 pb-4 text-xl text-slate-600 bg-white rounded-b-lg',
                    { 'border border-t-0 border-gray-200': open }
                  )}
                >
                  A: {i?.answer}?
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </ul>
    </section>
  );
};

export default FaqSection;

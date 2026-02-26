/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CurSorProps {
  rel: 'next' | 'prev';
  ariaDisable: boolean;
  page: number;
}
export const CurSor: React.FC<CurSorProps> = ({ rel, ariaDisable, page }) => {
  const router = useRouter();

  const { device, path, ...query } = router.query;

  return (
    <li>
      <Link
        href={{
          pathname: router.pathname,
          query: { ...query, page }
        }}
        scroll={true}
        shallow={true}
        className={classNames(
          ' block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
          {
            'rounded-l-lg': rel === 'prev',
            'rounded-r-lg': rel === 'next',
            'hover:shadow md:shadow-none cursor-pointer': !ariaDisable,
            'opacity-30 cursor-default': ariaDisable
          }
        )}
        tabIndex={0}
        role="button"
        aria-disabled={ariaDisable}
        aria-label={`${rel} page`}
        rel={rel}>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={classNames('feather feather-chevron-right w-6 h-6', {
            'transform rotate-180': rel === 'prev'
          })}
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>

      </Link>
    </li>
  );
};

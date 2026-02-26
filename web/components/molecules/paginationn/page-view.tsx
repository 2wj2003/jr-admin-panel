import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PageViewProps {
  isSelect: boolean;
  page: number;
}

export const PageView: React.FC<PageViewProps> = ({ isSelect, page }) => {
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
        role="button"
        className={classNames({
          'py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
            !isSelect,
          'z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
            isSelect
        })}
        tabIndex={0}
        aria-label={'Page ' + page + ' is your current page'}
        aria-current={isSelect ? 'page' : 'false'}>

        {page}

      </Link>
    </li>
  );
};

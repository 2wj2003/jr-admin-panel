"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  totalPages: number;
  currentPage: number;
  pageRange?: number;
}

export const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage,
  pageRange = 5,
}) => {

  const searchParams = useSearchParams();

  searchParams?.keys
    
  const pathname = usePathname();

  let startPage, endPage;
  if (totalPages <= pageRange) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.ceil(pageRange / 2)) {
      startPage = 1;
      endPage = pageRange;
    } else if (currentPage + Math.floor(pageRange / 2) >= totalPages) {
      startPage = totalPages - (pageRange - 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(pageRange / 2);
      endPage = currentPage + Math.floor(pageRange / 2);
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages === 1) {
    return null;
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link
          className="page-number"
          href={{
            pathname,
            query: { page: currentPage - 1 },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {"<"}
        </Link>
      )}
      {pageNumbers.map((number) => (
        <Link
          key={number}
          className={
            number === currentPage ? "page-number  active" : "page-number"
          }
          href={{
            pathname,
            query: { page: number },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {number}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          className="page-number"
          href={{
            pathname,
            query: { page: currentPage + 1 },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {">"}
        </Link>
      )}
    </div>
  );
};

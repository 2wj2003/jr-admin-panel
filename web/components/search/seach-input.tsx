"use client";

import React, { useEffect, useState } from "react";

import { Product } from "@lib/@generated/graphql";
import Link from "next/link";
import { useRouter } from "next/navigation";
import cx from "classnames";

export function SearchInput() {
  const router = useRouter();

  const [shouldShow, setShouldShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShouldShow(true);
    setSearchTerm(value);
  };

  useEffect(() => {
    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    const { signal } = newController;

    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `https://api.jr.co.th/api/fuzzy-search/search?query=${searchTerm}`,
          {
            signal,
          }
        );
        const data = await response.json();
        if (data.products) {
          // setSubmitted(false);
          setResults(data.products);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const delayTimer = setTimeout(fetchResults, 300);

    setController(newController);

    return () => {
      clearTimeout(delayTimer);
      newController.abort();
    };
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const url = "/search?keyword=" + searchTerm;
    e.preventDefault();

    setShouldShow(false);
    router.push(url);
  };

  const handleLinkClick = () => {
    setShouldShow(false);
  };

  return (
    <div className="text-sm">
      <form className="flex items-center" onSubmit={handleSubmit}>
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            name="keyword"
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาสินค้า ประเภทสินค้า แบรนด์"
            onChange={handleChange}
            required
          />
          <ul
            className={cx("absolute bg-white max-w-md", {
              hidden: !shouldShow,
              "inline-block": !shouldShow,
            })}
          >
            {results.map((result) => (
              <li key={result.slug}>
                <Link
                  href={`/products/${result.slug}`}
                  className="hover:bg-slate-100 p-2 block"
                  onClick={handleLinkClick}
                >
                  {result?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}

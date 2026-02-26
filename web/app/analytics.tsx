"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@lib/gtm";

export default function Analytics({}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let newPageViewPath: string | undefined;

    if (pathname) {
      newPageViewPath = pathname + searchParams?.toString();
      pageview(newPageViewPath);
    }
  }, [pathname, searchParams]);

  return <></>;
}

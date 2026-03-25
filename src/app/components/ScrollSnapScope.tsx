"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CLASS = "snap-scroll-page";

/**
 * Enables viewport scroll snapping on the home page only (full-height sections).
 */
export default function ScrollSnapScope() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (pathname === "/") {
      root.classList.add(CLASS);
    } else {
      root.classList.remove(CLASS);
    }
    return () => root.classList.remove(CLASS);
  }, [pathname]);

  return null;
}

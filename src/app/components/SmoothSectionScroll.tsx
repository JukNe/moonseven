"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const ROOT_CLASS = "home-smooth-sections";
const SECTION_IDS = ["home", "about", "tools", "contact"] as const;

function getSections(): HTMLElement[] {
  return SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => el !== null,
  );
}

/**
 * On the home page, wheel/trackpad moves between sections with the same smooth
 * animation as anchor / navbar navigation. Long sections still scroll normally
 * until you reach their top or bottom edge.
 */
export default function SmoothSectionScroll() {
  const pathname = usePathname();
  const animatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (pathname !== "/") {
      root.classList.remove(ROOT_CLASS);
      return;
    }
    root.classList.add(ROOT_CLASS);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => root.classList.remove(ROOT_CLASS);
    }

    const eps = 4;

    const endAnimationSoon = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        animatingRef.current = false;
      }, 750);
    };

    const onWheel = (e: WheelEvent) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }

      const sections = getSections();
      if (sections.length === 0) return;

      const st = window.scrollY;
      const vh = window.innerHeight;
      const delta = e.deltaY;

      let idx = 0;
      const centerY = st + vh / 2;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (centerY >= top && centerY < bottom) {
          idx = i;
          break;
        }
        if (centerY < top) {
          idx = Math.max(0, i - 1);
          break;
        }
        idx = i;
      }

      const el = sections[idx];
      const sectionTop = el.offsetTop;
      const sectionBottom = sectionTop + el.offsetHeight;

      if (delta > 0) {
        if (st + vh < sectionBottom - eps) {
          return;
        }
        if (idx >= sections.length - 1) {
          return;
        }
        e.preventDefault();
        animatingRef.current = true;
        const next = sections[idx + 1];
        window.scrollTo({
          top: next.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
        endAnimationSoon();
        return;
      }

      if (delta < 0) {
        if (st > sectionTop + eps) {
          return;
        }
        if (idx <= 0) {
          return;
        }
        e.preventDefault();
        animatingRef.current = true;
        const prev = sections[idx - 1];
        window.scrollTo({
          top: prev.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
        endAnimationSoon();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      root.classList.remove(ROOT_CLASS);
      window.removeEventListener("wheel", onWheel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return null;
}

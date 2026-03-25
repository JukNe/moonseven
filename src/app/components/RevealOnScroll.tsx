"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay before the transition runs (e.g. stagger in ms). */
  delayMs?: number;
};

/**
 * Fades/slides content in when it enters the viewport (Intersection Observer).
 * Respects `prefers-reduced-motion`: shows immediately without animation.
 */
export default function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const show = () => setVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(el);

    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.05;
    if (inView) {
      show();
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = visible
    ? { transitionDelay: `${delayMs}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`transform-gpu transition-[opacity,transform] duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type LanguageOption = { value: string; label: string };

function toggleLanguage(
  current: string[],
  value: string,
  checked: boolean,
): string[] {
  if (value === "all") {
    return checked ? ["all"] : ["english"];
  }
  let next = current.filter((v) => v !== "all");
  if (checked) {
    next = [...new Set([...next, value])];
  } else {
    next = next.filter((v) => v !== value);
  }
  if (next.length === 0) next = ["english"];
  return next;
}

function summaryLabel(value: string[], options: LanguageOption[]): string {
  if (value.includes("all")) return "All languages";
  const labels = value.map(
    (v) => options.find((o) => o.value === v)?.label ?? v,
  );
  if (labels.length <= 3) return labels.join(", ");
  return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
}

type Props = {
  id?: string;
  label: string;
  options: LanguageOption[];
  value: string[];
  onChange: (langs: string[]) => void;
};

export function LanguageMultiSelect({
  id,
  label,
  options,
  value,
  onChange,
}: Props) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const onToggleOption = useCallback(
    (optValue: string, checked: boolean) => {
      onChange(toggleLanguage(value, optValue, checked));
    },
    [value, onChange],
  );

  return (
    <div className="relative w-full" ref={wrapRef}>
      <label
        className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
        htmlFor={triggerId}
      >
        {label}
      </label>
      <button
        type="button"
        id={triggerId}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-left text-sm text-zinc-900 transition hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="min-w-0 truncate">
          {summaryLabel(value, options)}
        </span>
        <span className="shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open ? (
        <div
          id={listId}
          className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
          aria-multiselectable="true"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="max-h-56 overflow-y-auto p-2">
            {options.map((o) => {
              const checked =
                o.value === "all"
                  ? value.includes("all")
                  : value.includes(o.value) && !value.includes("all");
              return (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-950"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-zinc-400 bg-white text-indigo-600 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-950 dark:text-indigo-500"
                    checked={checked}
                    onChange={(e) =>
                      onToggleOption(o.value, e.target.checked)
                    }
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
          <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-500">
            &quot;All languages&quot; is exclusive. Otherwise pick any
            combination; results are merged and deduped.
          </p>
        </div>
      ) : null}
    </div>
  );
}

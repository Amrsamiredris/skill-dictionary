"use client";

import { useCallback, useEffect, useRef } from "react";

type PillItem = { id: string; label: string };

export function PillBar({
  items,
  activeId,
  onSelect,
  dataAttr,
  ariaLabelledBy,
}: {
  items: PillItem[];
  activeId: string;
  onSelect: (id: string) => void;
  dataAttr: "data-role" | "data-cat";
  ariaLabelledBy: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const moveIndicator = useCallback(() => {
    const bar = barRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator) return;
    const active = bar.querySelector(
      `[${dataAttr}="${activeId}"]`,
    ) as HTMLElement | null;
    if (!active) return;
    const barRect = bar.getBoundingClientRect();
    const tabRect = active.getBoundingClientRect();
    indicator.style.width = `${tabRect.width}px`;
    indicator.style.transform = `translateX(${tabRect.left - barRect.left}px)`;
  }, [activeId, dataAttr]);

  useEffect(() => {
    requestAnimationFrame(moveIndicator);
  }, [activeId, moveIndicator]);

  useEffect(() => {
    const onResize = () => moveIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveIndicator]);

  const attrName = dataAttr === "data-role" ? "data-role" : "data-cat";

  return (
    <div
      className="pill-bar"
      ref={barRef}
      role="tablist"
      aria-labelledby={ariaLabelledBy}
    >
      <div className="pill-indicator" ref={indicatorRef} aria-hidden="true" />
      {items.map((item) => {
        const selected = activeId === item.id;
        return (
          <button
            key={item.id}
            className="pill"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            {...{ [attrName]: item.id }}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => {
              const pills = Array.from(
                barRef.current?.querySelectorAll(".pill") ?? [],
              ) as HTMLButtonElement[];
              const idx = pills.findIndex((p) => p === e.currentTarget);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                pills[(idx + 1) % pills.length]?.focus();
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                pills[(idx - 1 + pills.length) % pills.length]?.focus();
              }
            }}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";

export const MOTION = {
  hide: 240,
  enter: 420,
  enterStagger: 28,
  enterStaggerMax: 320,
  filterStagger: 22,
  filterStaggerMax: 220,
  modal: 360,
} as const;

export function staggerDelay(
  index: number,
  step: number = MOTION.enterStagger,
  max: number = MOTION.enterStaggerMax,
): number {
  return Math.min(index * step, max);
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useReveal(
  enabled: boolean,
  deps: unknown[] = [],
): boolean {
  const [revealed, setRevealed] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setRevealed(true);
      return;
    }

    setRevealed(false);
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setRevealed(true));
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return revealed;
}

export function useOverlayState(open: boolean, duration = MOTION.modal) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let frame2 = 0;
      const frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => setActive(true));
      });
      return () => {
        cancelAnimationFrame(frame1);
        cancelAnimationFrame(frame2);
      };
    }

    setActive(false);
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration]);

  return { mounted, active };
}

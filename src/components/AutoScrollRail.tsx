"use client";
import React, { useCallback, useEffect, useRef } from "react";

interface AutoScrollRailProps {
  /** The (already duplicated) card elements to scroll. */
  children: React.ReactNode;
  /** Auto-scroll speed in pixels per second. */
  speed?: number;
  /** Accessible label for the scroll region. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Flagship product rail: continuous auto-scroll marquee that the user can ALSO
 * scroll by hand (drag / swipe / wheel) and step through with Prev/Next buttons.
 *
 * The children must be the list rendered twice (e.g. [...items, ...items].map())
 * so the loop is seamless — the wrap distance is measured live from the DOM.
 */
export default function AutoScrollRail({
  children,
  speed = 70,
  ariaLabel = "Product carousel",
  className = "",
}: AutoScrollRailProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);
  const reducedRef = useRef(false);
  const wrapRef = useRef(0); // width of one full copy of the children
  const resumeTimerRef = useRef<number | null>(null);

  // Distance to scroll before the second copy lines up with the first.
  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.children.length < 2) return;
    const mid = Math.floor(el.children.length / 2);
    const first = el.children[0] as HTMLElement;
    const midEl = el.children[mid] as HTMLElement;
    wrapRef.current = Math.max(0, midEl.offsetLeft - first.offsetLeft);
  }, []);

  // Keep scrollLeft within [0, wrap) so the loop never reveals an empty edge.
  const normalize = useCallback(() => {
    const el = scrollerRef.current;
    const wrap = wrapRef.current;
    if (!el || wrap <= 0) return;
    if (el.scrollLeft >= wrap) el.scrollLeft -= wrap;
    else if (el.scrollLeft < 0) el.scrollLeft += wrap;
  }, []);

  const clearResume = () => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };
  const pause = useCallback(() => {
    pausedRef.current = true;
    clearResume();
  }, []);
  const scheduleResume = useCallback((delay: number) => {
    clearResume();
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, delay);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();

    // Time-based loop → constant speed regardless of display refresh rate.
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      const wrap = wrapRef.current;
      if (!reducedRef.current && !pausedRef.current && inViewRef.current && wrap > 0) {
        el.scrollLeft += (speed * dt) / 1000;
        if (el.scrollLeft >= wrap) el.scrollLeft -= wrap;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Don't burn cycles while the rail is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearResume();
    };
  }, [speed, measure]);

  // Step ~one viewport; pause auto-move, then ease back in.
  const nav = useCallback(
    (dir: 1 | -1) => {
      const el = scrollerRef.current;
      if (!el) return;
      pause();
      const amount = Math.max(el.clientWidth * 0.8, 280);
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
      scheduleResume(2200);
    },
    [pause, scheduleResume]
  );

  const btnClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center " +
    "rounded-full bg-[var(--bg)]/80 dark:bg-[#161f20]/80 backdrop-blur-md border border-[var(--text)]/10 " +
    "text-[var(--text)] shadow-[0_8px_24px_-10px_rgba(18,26,27,0.45)] " +
    "transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-transparent " +
    "hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50";

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={pause}
        onMouseLeave={() => scheduleResume(500)}
        onPointerDown={pause}
        onPointerUp={() => scheduleResume(1600)}
        onTouchStart={pause}
        onTouchEnd={() => scheduleResume(1600)}
        onWheel={() => {
          pause();
          scheduleResume(1400);
        }}
        onScroll={normalize}
        className="flex gap-8 overflow-x-auto overflow-y-hidden no-scrollbar overscroll-x-contain py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Previous products"
        onClick={() => nav(-1)}
        className={`${btnClass} left-1`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next products"
        onClick={() => nav(1)}
        className={`${btnClass} right-1`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

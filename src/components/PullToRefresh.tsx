import { useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

const THRESHOLD = 70;
const MAX = 110;

export function PullToRefresh({ children }: { children: ReactNode }) {
  const { refresh, t, loading } = useStore();
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || loading) return;
      startY.current = e.touches[0].clientY;
      active.current = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active.current || startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        e.preventDefault?.();
        setPull(Math.min(MAX, dy * 0.5));
      }
    };
    const onTouchEnd = async () => {
      if (!active.current) return;
      const shouldRefresh = pull >= THRESHOLD;
      active.current = false;
      startY.current = null;
      setPull(0);
      if (shouldRefresh) await refresh();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pull, refresh, loading]);

  const visible = pull > 8 || loading;
  const ready = pull >= THRESHOLD;

  return (
    <>
      <div
        aria-hidden={!visible}
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 flex justify-center"
        style={{
          transform: `translateY(${Math.min(pull, MAX) - (visible ? 0 : 40)}px)`,
          opacity: visible ? 1 : 0,
          transition: pull === 0 ? "transform 200ms ease, opacity 200ms ease" : "none",
        }}
      >
        <div className="mt-2 grid place-items-center size-10 rounded-full glass">
          <Loader2
            className={`size-5 text-accent ${loading || ready ? "animate-spin" : ""}`}
            style={{ transform: `rotate(${pull * 3}deg)` }}
          />
        </div>
      </div>
      {pull > 0 ? (
        <div
          className="text-center text-xs text-muted-foreground -mt-2 mb-2"
          style={{ opacity: Math.min(1, pull / THRESHOLD) }}
        >
          {ready ? t("release_to_refresh") : t("pull_to_refresh")}
        </div>
      ) : null}
      {children}
    </>
  );
}

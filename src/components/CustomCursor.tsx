import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setHidden(false);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx - 5}px, ${my - 5}px, 0)`;
      }
      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-cursor], a, button, [role=button]");
      if (interactive) {
        const t = interactive.getAttribute("data-cursor");
        setLabel(t);
      } else {
        setLabel(null);
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  const active = label !== null;
  const isPill = label === "View" || label === "Book";

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 z-[100] pointer-events-none h-2.5 w-2.5 rounded-full bg-[color:var(--charcoal)]"
        style={{
          opacity: active ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 z-[100] pointer-events-none flex items-center justify-center rounded-full"
        style={{
          height: isPill ? 56 : active ? 56 : 36,
          width: isPill ? 76 : active ? 56 : 36,
          background: isPill
            ? "var(--forest-deep)"
            : active
              ? "rgba(47, 168, 74, 0.12)"
              : "transparent",
          border: isPill ? "none" : "1.5px solid var(--trail-green)",
          color: "#fff",
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, border-color 0.4s",
        }}
      >
        {isPill && label}
      </div>
    </>
  );
}

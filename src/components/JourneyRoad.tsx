import { useEffect, useRef, useState } from "react";

const MILESTONES = [
  { at: 0.08, label: "The City" },
  { at: 0.32, label: "The Road" },
  { at: 0.6, label: "The Wild" },
  { at: 0.88, label: "The Summit" },
];

export function JourneyRoad() {
  const [progress, setProgress] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(2000);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop */}
      <div
        aria-hidden
        className="hidden lg:block pointer-events-none fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-[60px] z-10"
        style={{ height: "100vh" }}
      >
        <svg
          viewBox="0 0 60 800"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M30 0 C 55 120, 5 220, 30 340 S 55 560, 30 680 S 5 780, 30 800"
            fill="none"
            stroke="rgba(23,24,26,0.08)"
            strokeWidth="1.5"
          />
          <path
            ref={pathRef}
            d="M30 0 C 55 120, 5 220, 30 340 S 55 560, 30 680 S 5 780, 30 800"
            fill="none"
            stroke="var(--trail-green)"
            strokeWidth="1.8"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
          {MILESTONES.map((m, i) => {
            const active = progress >= m.at - 0.02;
            return (
              <circle
                key={i}
                cx="30"
                cy={m.at * 800}
                r={active ? 5 : 3}
                fill={active ? "var(--trail-green)" : "rgba(23,24,26,0.15)"}
                style={{ transition: "all 0.5s" }}
              />
            );
          })}
        </svg>
      </div>

      {/* Mobile */}
      <div
        aria-hidden
        className="lg:hidden pointer-events-none fixed top-0 bottom-0 left-1 w-0.5 bg-black/5 z-10"
      >
        <div
          className="w-full bg-[color:var(--trail-green)]"
          style={{ height: `${progress * 100}%`, transition: "height 0.2s linear" }}
        />
      </div>
    </>
  );
}

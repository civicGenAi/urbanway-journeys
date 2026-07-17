import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const MotionAs = motion(As as any);
  return (
    <MotionAs
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionAs>
  );
}

export function RevealStagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealChild({
  children,
  className,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SplitHeading({
  text,
  className,
  as: As = "h2",
  italicWord,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  italicWord?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(" ");
  const Tag = As;
  return (
    <Tag ref={ref} className={className} style={{ overflow: "hidden" }}>
      <span style={{ display: "inline-block" }}>
        {words.map((w, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.1em",
              marginRight: "0.25em",
            }}
          >
            <motion.span
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              style={{
                display: "inline-block",
                fontStyle: w === italicWord ? "italic" : undefined,
                color: w === italicWord ? "var(--trail-green)" : undefined,
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

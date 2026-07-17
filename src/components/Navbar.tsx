import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/bookings", label: "Bookings" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const overHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const textColor = overHero ? "text-white" : "text-[color:var(--charcoal)]";
  const barBg = overHero
    ? "bg-transparent"
    : "bg-[color:var(--kilimanjaro-snow)]/85 backdrop-blur-xl border-b border-black/5";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${barBg}`}
      >
        <div className="container-lodge flex items-center justify-between h-20">
          <Link to="/" className="flex items-baseline gap-0.5 font-display text-2xl tracking-tight">
            <span className="text-[color:var(--trail-green)] font-semibold italic">Urban</span>
            <span className={`${overHero ? "text-white" : "text-[color:var(--charcoal)]"} font-semibold`}>Way</span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-sm font-medium link-slide ${textColor} ${active ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[color:var(--trail-green)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Link to="/bookings" className="hidden md:inline-flex btn-primary text-sm py-3 px-5">
            Plan Your Safari <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            aria-label="Toggle menu"
            className={`md:hidden p-2 ${textColor}`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[color:var(--forest-deep)] md:hidden flex flex-col justify-center px-8"
          >
            <ul className="space-y-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={l.to} className="font-display text-white text-5xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-16 text-white/70 text-sm space-y-2">
              <p>Arusha, Tanzania</p>
              <p>hello@urbanwaytours.co.tz</p>
              <p>WhatsApp: +255 000 000 000</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

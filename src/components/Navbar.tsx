import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/bookings", label: "Plan With Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
          <Link to="/" className="flex items-center" aria-label="UrbanWay Tours & Safari">
            <img src="/logo-mark.png" alt="UrbanWay Tours & Safari" className="h-12 sm:h-14 w-auto" />
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

          <div className="hidden md:flex items-center gap-5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={`${textColor} opacity-80 hover:opacity-100 transition-opacity`}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/services" className="btn-primary text-sm py-3 px-5">
              Plan Your Safari <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className={`md:hidden relative h-10 w-10 ${textColor}`}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.75rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.75rem) 2.75rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.75rem)" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "radial-gradient(circle at calc(100% - 2.75rem) 2.75rem, var(--trail-green) 0%, var(--forest-deep) 60%)",
            }}
            className="fixed inset-0 z-40 md:hidden flex flex-col justify-center px-8 overflow-hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -right-6 font-display font-semibold leading-none select-none text-[32vw]"
              style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.07)" }}
            >
              Way
            </div>

            <motion.button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-10 inline-flex items-center gap-3 self-start rounded-full border border-white/25 px-5 py-3 text-white/85"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Search the site</span>
            </motion.button>

            <ul className="relative space-y-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={l.to} className="font-display text-white text-5xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + links.length * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-16 text-white/70 text-sm space-y-2"
            >
              <p>Arusha, Tanzania</p>
              <p>hello@urbanwaytours.co.tz</p>
              <p>WhatsApp: +255 000 000 000</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

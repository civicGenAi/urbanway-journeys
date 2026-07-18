import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { searchSite } from "../lib/searchIndex";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSite(query), [query]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-[color:var(--charcoal)]/70 flex items-start justify-center p-4 pt-24 sm:pt-32"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-3 px-6 py-5 border-b border-black/10">
              <Search className="h-5 w-5 text-[color:var(--charcoal)]/40 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trips, categories, pages..."
                className="flex-1 outline-none text-lg placeholder:text-[color:var(--charcoal)]/40"
              />
              <button onClick={handleClose} aria-label="Close search" className="p-1">
                <X className="h-5 w-5 text-[color:var(--charcoal)]/50" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === "" ? (
                <p className="px-6 py-10 text-center text-sm text-[color:var(--charcoal)]/50">
                  Try "Serengeti", "car hire", or "airport transfer".
                </p>
              ) : results.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-[color:var(--charcoal)]/50">
                  No matches for "{query}".
                </p>
              ) : (
                <ul className="divide-y divide-black/5">
                  {results.map((r, i) => (
                    <li key={i}>
                      {r.kind === "trip" && (
                        <Link
                          to="/trips/$slug"
                          params={{ slug: r.slug }}
                          onClick={handleClose}
                          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-black/[0.03] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-lg truncate">{r.title}</p>
                            <p className="text-xs text-[color:var(--charcoal)]/50 truncate">{r.subtitle}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[color:var(--trail-green)] shrink-0" />
                        </Link>
                      )}
                      {r.kind === "category" && (
                        <Link
                          to="/services/$category"
                          params={{ category: r.slug }}
                          onClick={handleClose}
                          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-black/[0.03] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-lg truncate">{r.title}</p>
                            <p className="text-xs text-[color:var(--charcoal)]/50 truncate">{r.subtitle}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[color:var(--trail-green)] shrink-0" />
                        </Link>
                      )}
                      {r.kind === "page" && (
                        <Link
                          to={r.to}
                          onClick={handleClose}
                          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-black/[0.03] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-lg truncate">{r.title}</p>
                            <p className="text-xs text-[color:var(--charcoal)]/50 truncate">{r.subtitle}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[color:var(--trail-green)] shrink-0" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

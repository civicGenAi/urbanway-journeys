import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

export function FloatingBookButton() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = location.pathname === "/services" || location.pathname === "/bookings";

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-30 md:hidden"
        >
          <Link
            to="/services"
            className="btn-primary shadow-[0_10px_30px_rgba(23,24,26,0.25)] py-3 px-5 text-sm"
            data-cursor="Book"
          >
            <Compass className="h-4 w-4" /> Plan Safari
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

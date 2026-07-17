import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="relative bg-[color:var(--forest-deep)] text-white/85 pt-16 md:pt-24 pb-10 overflow-hidden">
      <div className="container-lodge relative z-10 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-3xl">
            <span className="text-[color:var(--trail-green)] italic">Urban</span>
            <span className="text-white">Way</span>
          </div>
          <p className="mt-4 text-sm max-w-xs text-white/70 leading-relaxed">
            Tanzanian hosts, licensed guides, modern 4x4s. From Arusha to the Serengeti and beyond.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[color:var(--trail-green)] hover:border-transparent transition-all duration-500"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <p className="eyebrow text-[color:var(--trail-green)] mb-4">Explore</p>
          <ul className="space-y-3 text-sm">
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["Bookings", "/bookings"],
              ["Gallery", "/gallery"],
              ["Reviews", "/reviews"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="link-slide hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <p className="eyebrow text-[color:var(--trail-green)] mb-4">Services</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li>Wildlife Safaris</li>
            <li>Airport Transfers</li>
            <li>Day Trips & Culture</li>
            <li>Car Hire</li>
            <li>VIP Transport</li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="eyebrow text-[color:var(--trail-green)] mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li>Arusha, Tanzania</li>
            <li>+255 000 000 000</li>
            <li>WhatsApp available 24/7</li>
            <li>hello@urbanwaytours.co.tz</li>
          </ul>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              toast.success("Karibu! You are on the list.");
              setEmail("");
            }}
            className="mt-6 flex items-center gap-2 border-b border-white/25 pb-2 max-w-sm"
          >
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-white/40"
            />
            <button type="submit" aria-label="Subscribe" className="text-[color:var(--trail-green)]">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 bottom-2 font-display font-semibold text-center leading-none select-none"
        style={{
          fontSize: "clamp(6rem, 20vw, 22rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.08)",
        }}
      >
        UrbanWay
      </div>

      <div className="container-lodge relative z-10 mt-16 md:mt-24 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4 text-xs text-white/50 text-center sm:text-left">
        <p>© {new Date().getFullYear()} UrbanWay Tours & Safari. All rights reserved.</p>
        <p>Handcrafted in Arusha, Tanzania.</p>
      </div>
    </footer>
  );
}

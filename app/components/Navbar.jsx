"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "./Icons";

const links = ["Product", "Pricing", "Audit", "Customers", "Credex"];

export default function Navbar() {
  const [theme, setTheme] = useState("dark"); // "dark" = dark text on light bg, "light" = light text on dark bg

  useEffect(() => {
    const onScroll = () => {
      const navY = 16 + 24; // top-4 + half nav height
      const cta = document.querySelector('[data-screen-label="final-cta"]');
      const ctaTop = cta ? cta.getBoundingClientRect().top + window.scrollY : Infinity;
      const scrollPos = window.scrollY + navY;

      if (scrollPos < window.innerHeight * 0.7) {
        setTheme("dark");
      } else if (scrollPos >= ctaTop) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";
  const fg = isDark ? "#0a0907" : "#f3ead8";
  const fgMuted = isDark
    ? "rgba(10,9,7,0.85)"
    : "rgba(243,234,216,0.9)";
  const ctaBg = isDark ? "#0a0907" : "#f3ead8";
  const ctaFg = isDark ? "#f3ead8" : "#0a0907";

  return (
    <motion.nav
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16"
    >
      <div className="flex items-center justify-between liquid-glass-strong rounded-full px-2 py-2">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Veridex" className="w-10 h-10 object-cover" />
        </div>

        <div className="hidden md:flex items-center">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="px-3 py-2 text-sm font-medium font-body whitespace-nowrap"
              style={{ color: fgMuted, transition: "color 0.4s ease" }}
            >
              {l}
            </a>
          ))}
          <a
            href="/audit"
            className="ml-1 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
            style={{
              background: ctaBg,
              color: ctaFg,
              transition: "background 0.4s ease, color 0.4s ease",
            }}
          >
            Start audit
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "./Icons";

const links = ["Product", "Pricing", "Audit", "Customers", "Credex"];

export default function Navbar() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fg = scrolledPastHero ? "#f3ead8" : "#0a0907";
  const fgMuted = scrolledPastHero
    ? "rgba(243,234,216,0.9)"
    : "rgba(10,9,7,0.85)";
  const ctaBg = scrolledPastHero ? "#f3ead8" : "#0a0907";
  const ctaFg = scrolledPastHero ? "#0a0907" : "#f3ead8";

  return (
    <motion.nav
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16"
    >
      <div className="flex items-center  justify-between">
        <div className="w-12 h-12 rounded-full flex items-center justify-center border-1 border-black">
          <span
            className="relative z-10 font-heading italic text-2xl leading-none"
            style={{
              marginTop: "-2px",
              color: fg,
              transition: "color 0.4s ease",
            }}
          >
            a
          </span>
        </div>

        <div
          className="hidden md:flex rounded-full px-1.5 py-1.5 items-center  border-1 border-black"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div className="relative z-10 flex items-center">
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
              href="#"
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

        <div className="w-12 h-12 invisible" aria-hidden="true" />
      </div>
    </motion.nav>
  );
}

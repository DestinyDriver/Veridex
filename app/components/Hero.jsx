"use client";
import { motion } from "framer-motion";
import SpotlightReveal from "./SpotlightReveal";
import BlurText from "./BlurText";
import Navbar from "./Navbar";
import { ArrowUpRight, PlayIcon, ClockIcon, GlobeIcon } from "./Icons";

const fadeIn = (delay) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

function StatCard({ icon, value, label }) {
  return (
    <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col items-start text-left">
      <div className="relative z-10 text-black">{icon}</div>
      <div className="relative z-10 mt-6 font-heading italic text-black text-4xl leading-none tracking-[-1px]">
        {value}
      </div>
      <div className="relative z-10 text-xs text-black font-body font-light mt-2">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <SpotlightReveal
        baseImageSrc="/hero/base.png"
        revealImageSrc="/hero/layerHero.png"
        baseRadius={420}
      />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center text-center pt-24 px-4">
          <div className="mt-6">
            <BlurText
              text="Optimize Beyond the Surface"
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-black leading-[0.8] max-w-2xl tracking-[-4px]"
            />
          </div>

          <motion.p
            {...fadeIn(0.8)}
            className="mt-4 text-sm md:text-base text-black max-w-2xl font-body font-light leading-tight"
          >
            Discover hidden overspending across ChatGPT, Claude, Cursor, and
            more. Built for startups that scale fast — without wasting money.
          </motion.p>

          <motion.div {...fadeIn(1.1)} className="flex items-center gap-6 mt-6">
            <a
              href="/audit"
              className=" rounded-full px-5 py-2.5 text-sm font-medium text-black inline-flex items-center gap-2 border border-1 border-black"
            >
              <span className="relative z-10 inline-flex items-center gap-2 ">
                Run Free Audit
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href="/audit"
              className="text-sm font-medium text-black inline-flex items-center gap-2"
            >
              View Sample Report
              <PlayIcon className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          {...fadeIn(1.4)}
          className="flex flex-col items-center gap-4 pb-8"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1">
            <span className="relative z-10 text-xs font-medium text-black font-body">
              Collaborating with AI-first startups globally
            </span>
          </div>
          <div className="flex items-center gap-12 md:gap-16 font-heading italic text-black text-2xl md:text-3xl tracking-tight">
            <span>Aeon</span>
            <span>Vela</span>
            <span>Apex</span>
            <span>Orbit</span>
            <span>Zeno</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

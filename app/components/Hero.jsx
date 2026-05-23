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
      <div
        className="relative z-10 mt-6 font-heading italic text-black text-4xl leading-none tracking-[-1px]"
      >
        {value}
      </div>
      <div className="relative z-10 text-xs text-black font-body font-light mt-2">{label}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <SpotlightReveal
        baseImageSrc="https://lh3.googleusercontent.com/d/19tIxm0iaVujPtTFcJBcNrqj_5KdWXPrH=w2400"
        revealImageSrc="https://lh3.googleusercontent.com/d/1I_DIuqairjjeP1GIv9zMcv2dtOJtwBLP=w2400"
        baseRadius={420}
      />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center text-center pt-24 px-4">
          <motion.div {...fadeIn(0.4)}>
            <div className="liquid-glass rounded-full inline-flex items-center gap-2 pl-1 pr-3 py-1">
              <span className="relative z-10 bg-white text-black px-3 py-1 text-xs font-semibold rounded-full font-body">
                New
              </span>
              <span className="relative z-10 text-sm text-black/90 font-body">
                Maiden Crewed Voyage to Mars Arrives 2026
              </span>
            </div>
          </motion.div>

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
            Discover hidden overspending across ChatGPT, Claude, Cursor, and more. Built for startups
            that scale fast — without wasting money.
          </motion.p>

          <motion.div {...fadeIn(1.1)} className="flex items-center gap-6 mt-6">
            <a
              href="#"
              className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-black inline-flex items-center gap-2"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Start Your Voyage
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a href="#" className="text-sm font-medium text-black inline-flex items-center gap-2">
              View Liftoff
              <PlayIcon className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div {...fadeIn(1.3)} className="flex items-stretch gap-4 mt-8">
            <StatCard
              icon={<ClockIcon className="h-7 w-7 text-black" />}
              value="34.5 Min"
              label="Average Videos Watch Time"
            />
            <StatCard
              icon={<GlobeIcon className="h-7 w-7 text-black" />}
              value="2.8B+"
              label="Users Across the Globe"
            />
          </motion.div>
        </div>

        <motion.div {...fadeIn(1.4)} className="flex flex-col items-center gap-4 pb-8">
          <div className="liquid-glass rounded-full px-3.5 py-1">
            <span className="relative z-10 text-xs font-medium text-black font-body">
              Collaborating with top aerospace pioneers globally
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

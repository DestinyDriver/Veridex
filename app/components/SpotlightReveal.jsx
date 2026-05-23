"use client";
import { useEffect, useRef } from "react";

const NUM_TRAILS = 6;

export default function SpotlightReveal({ baseImageSrc, revealImageSrc, baseRadius = 420 }) {
  const containerRef = useRef(null);
  const pointsRef = useRef(
    Array.from({ length: NUM_TRAILS }, () => ({ x: -1000, y: -1000 }))
  );

  useEffect(() => {
    const el = containerRef.current;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let rafId;

    const handleMouseMove = (e) => {
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const points = pointsRef.current;
      points[0].x += (targetX - points[0].x) * 0.2;
      points[0].y += (targetY - points[0].y) * 0.2;
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }
      for (let i = 0; i < points.length; i++) {
        const c = document.getElementById(`trail-${i}`);
        if (c) {
          c.setAttribute("cx", points[i].x.toString());
          c.setAttribute("cy", points[i].y.toString());
        }
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-[#0c0a06]">
      <svg width="0" height="0" aria-hidden="true" className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <radialGradient id="holeGradient">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="60%" stopColor="black" stopOpacity="0.8" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask
            id="spotlight-mask"
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
            x="0" y="0" width="3000" height="3000"
          >
            <rect x="0" y="0" width="3000" height="3000" fill="white" />
            {Array.from({ length: NUM_TRAILS }).map((_, i) => (
              <circle
                key={i}
                id={`trail-${i}`}
                cx="-1000" cy="-1000"
                r={baseRadius - i * 35}
                fill="url(#holeGradient)"
                opacity={1 - i * 0.15}
              />
            ))}
          </mask>
        </defs>
      </svg>

      {revealImageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={revealImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none"
          draggable="false"
        />
      )}

      {baseImageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={baseImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-[1] select-none"
          draggable="false"
          style={{
            WebkitMaskImage: "url(#spotlight-mask)",
            maskImage: "url(#spotlight-mask)",
            WebkitMaskMode: "luminance",
            maskMode: "luminance",
          }}
        />
      )}
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";

export default function CountUp({ end, duration = 1200 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = 0;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);

  return <>{value.toLocaleString()}</>;
}

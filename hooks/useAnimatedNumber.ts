import { useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";

export function useAnimatedNumber(value: number, duration = 0.4) {
  const motionValue = useMotionValue(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value, duration]);

  return motionValue;
}

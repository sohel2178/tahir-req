"use client";

import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

function Speed({ speed }: { speed: number }) {
  const count = useMotionValue(speed);

  // Use transform to round the count value
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Animate from the current value to the new `value` prop
    const controls = animate(count, speed, { duration: 2 }); // You can adjust the duration

    // Cleanup when the component unmounts or the value changes
    return () => controls.stop();
  }, [speed, count]);

  return (
    <motion.pre style={{ fontSize: "20px", fontFamily: "monospace" }}>
      {rounded}
    </motion.pre>
  );
}

export default Speed;

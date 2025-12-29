import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect } from "react";

export const MagneticCircle = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const circleXRaw = useTransform(mouseX, (value) => {
    const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    return (value - centerX) * 0.03;
  });

  const circleYRaw = useTransform(mouseY, (value) => {
    const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
    return (value - centerY) * 0.03;
  });

  const circleX = useSpring(circleXRaw, { stiffness: 150, damping: 20 });
  const circleY = useSpring(circleYRaw, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="absolute rounded-full border-[20px] md:border-[40px] border-terracotta"
      style={{
        width: "calc(var(--grid-cell) * 8)",
        height: "calc(var(--grid-cell) * 8)",
        left: "50%",
        top: "50%",
        x: circleX, // Magnetic offset + centering
        y: circleY,
        translateX: "-50%", // Center the element itself
        translateY: "-50%",
        // Additional offset to shift it relative to the 'center' grid line
        marginLeft: "calc(var(--grid-cell) * -2)",
        marginTop: "calc(var(--grid-cell) * -1)",
      }}
    />
  );
};

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
 
  useEffect(() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    setEnabled(canHover);
    if (!canHover) return;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursorDot"
        style={{ left: x, top: y }}
        animate={{ scale: down ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="cursorRing"
        style={{ left: ringX, top: ringY }}
        animate={{
          width: label ? 74 : 34,
          height: label ? 74 : 34,
          opacity: down ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {label && <span className="cursorLabel">{label}</span>}
      </motion.div>
    </>
  );
}

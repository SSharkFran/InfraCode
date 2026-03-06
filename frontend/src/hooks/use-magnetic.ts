import { useRef, useCallback, type MouseEvent } from "react";
import { useReducedMotion } from "./use-reduced-motion";

const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_RADIUS = 120;

export const useMagnetic = () => {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotion || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < MAGNETIC_RADIUS) {
        const pull = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
        el.style.transform = `translate(${distX * pull}px, ${distY * pull}px)`;
      } else {
        el.style.transform = "translate(0, 0)";
      }
    },
    [reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
      ref.current.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => {
        if (ref.current) ref.current.style.transition = "";
      }, 400);
    }
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
};

import { useState, useEffect, useCallback, useRef } from "react";

export type MousePosition = {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
};

export const useMousePosition = (containerRef?: React.RefObject<HTMLElement>) => {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
  });

  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef?.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setPosition({
            x,
            y,
            normalizedX: Math.max(0, Math.min(1, x / rect.width)),
            normalizedY: Math.max(0, Math.min(1, y / rect.height)),
          });
        } else {
          setPosition({
            x: e.clientX,
            y: e.clientY,
            normalizedX: e.clientX / window.innerWidth,
            normalizedY: e.clientY / window.innerHeight,
          });
        }
      });
    },
    [containerRef]
  );

  useEffect(() => {
    const target = containerRef?.current ?? window;
    target.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => {
      target.removeEventListener("mousemove", handleMouseMove as EventListener);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, containerRef]);

  return position;
};

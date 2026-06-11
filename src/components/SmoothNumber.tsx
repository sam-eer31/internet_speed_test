"use client";

import { useEffect, useRef } from "react";

interface SmoothNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

const STIFFNESS = 120;
const DAMPING = 22;
const MASS = 1;

export function SmoothNumber({ value, decimals = 2, className }: SmoothNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  
  const springPos = useRef(value);
  const springVel = useRef(0);
  const targetVal = useRef(value);
  const lastTs = useRef<number | null>(null);
  const rafId = useRef(0);

  useEffect(() => {
    targetVal.current = value;
  }, [value]);

  useEffect(() => {
    const animate = (now: number) => {
      if (lastTs.current === null) lastTs.current = now;
      const dt = Math.min((now - lastTs.current) / 1000, 0.05);
      lastTs.current = now;

      const pos = springPos.current;
      const vel = springVel.current;
      const tgt = targetVal.current;

      const acc = (-STIFFNESS * (pos - tgt) - DAMPING * vel) / MASS;
      const nVel = vel + acc * dt;
      const nPos = Math.max(0, pos + nVel * dt);

      springPos.current = nPos;
      springVel.current = nVel;

      if (spanRef.current) {
        spanRef.current.textContent = nPos.toFixed(decimals);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [decimals]);

  return <span ref={spanRef} className={className}>{value.toFixed(decimals)}</span>;
}

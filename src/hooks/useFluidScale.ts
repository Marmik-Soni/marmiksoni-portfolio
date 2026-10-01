'use client';

import { useEffect, useRef } from 'react';

// ⚠️ KEEP IN SYNC with layout.tsx initScript — same curve runs before React hydrates
const MIN_W = 1024;
const MAX_W = 2560;
const X1 = 0.35, Y1 = 0.15, X2 = 0.65, Y2 = 0.85;

function bez(t: number, a: number, b: number): number {
  const u = 1 - t;
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
}

function bezSlope(t: number, a: number, b: number): number {
  const u = 1 - t;
  return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
}

function ease(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  
  let t = x, i;
  for (i = 0; i < 8; i++) {
    const err = bez(t, X1, X2) - x;
    if (Math.abs(err) < 1e-6) break;
    const s = bezSlope(t, X1, X2);
    if (Math.abs(s) < 1e-6) break;
    t -= err / s;
  }
  
  if (!(t >= 0 && t <= 1) || Math.abs(bez(t, X1, X2) - x) > 1e-4) {
    let lo = 0, hi = 1;
    t = x;
    for (i = 0; i < 30; i++) {
      if (bez(t, X1, X2) < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
  }
  return bez(t, Y1, Y2);
}

export function useFluidScale() {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const w = root.clientWidth || window.innerWidth;
      const p = ease((w - MIN_W) / (MAX_W - MIN_W));
      root.style.setProperty('--p', p.toFixed(4));
    };

    // Initial update
    update();

    // Setup ResizeObserver for smooth scaling
    const resizeObserver = new ResizeObserver(() => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(update);
    });

    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
}

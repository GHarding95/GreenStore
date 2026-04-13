import { useEffect, useRef, useState, type RefObject } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * When the target enters the viewport, sets visible to true (once).
 * Respects prefers-reduced-motion by revealing immediately without waiting.
 */
export function useScrollReveal<T extends HTMLElement>(
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.12
): readonly [RefObject<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref as RefObject<T>, visible] as const;
}

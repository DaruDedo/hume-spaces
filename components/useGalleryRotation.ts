'use client';

import { useEffect, useState } from 'react';

export function useGalleryRotation(imageCount: number) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const active = index % Math.max(1, imageCount);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pauseForReducedMotion = () => {
      if (motion.matches) setPlaying(false);
    };
    pauseForReducedMotion();
    motion.addEventListener('change', pauseForReducedMotion);
    return () => motion.removeEventListener('change', pauseForReducedMotion);
  }, []);

  useEffect(() => {
    if (!playing || imageCount < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % imageCount);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [imageCount, playing]);

  function select(index: number) {
    setIndex(index);
    setPlaying(false);
  }

  return { active, playing, select, toggle: () => setPlaying(value => !value) };
}

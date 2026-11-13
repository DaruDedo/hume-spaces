'use client';

import {useEffect, useRef, useState} from 'react';

type SpaceServed = {count: number; label: string; icon: string};
const countDuration = 1150;
const cardStartInterval = 200;
const visibilityThreshold = 0.25;

export default function SpacesServedGrid({spaces}: {spaces: readonly SpaceServed[]}) {
  const gridRef = useRef<HTMLUListElement>(null);
  const [animatedCounts, setAnimatedCounts] = useState<Partial<Record<number, number>>>({});

  useEffect(() => {
    const grid = gridRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!grid || reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const section = grid.closest('section') ?? grid;
    const cardIndexes = new Map(Array.from(grid.children, (card, index) => [card, index]));
    const activeCounts = new Map<number, number>();
    const displayedCounts = new Map<number, number>();
    let sectionVisible = false;
    let nextIndex = 0;
    let lastVisibleIndex = -1;
    let nextStartTime = 0;
    let frame: number | undefined;

    function reset() {
      nextIndex = 0;
      lastVisibleIndex = -1;
      nextStartTime = 0;
      activeCounts.clear();
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
        frame = undefined;
      }
      if (displayedCounts.size) {
        displayedCounts.clear();
        setAnimatedCounts({});
      }
    }

    function animate(now: number) {
      if (reducedMotion.matches) {
        reset();
        return;
      }

      if (nextIndex <= lastVisibleIndex && now >= nextStartTime) {
        activeCounts.set(nextIndex, now);
        nextIndex += 1;
        nextStartTime = now + cardStartInterval;
      }

      let countsChanged = false;
      for (const [index, startTime] of activeCounts) {
        const progress = Math.min(1, (now - startTime) / countDuration);
        if (progress === 1) {
          activeCounts.delete(index);
          displayedCounts.delete(index);
          countsChanged = true;
        } else {
          const easedProgress = 1 - (1 - progress) ** 3;
          const value = Math.floor(spaces[index].count * easedProgress);
          if (displayedCounts.get(index) !== value) {
            displayedCounts.set(index, value);
            countsChanged = true;
          }
        }
      }

      if (countsChanged) setAnimatedCounts(Object.fromEntries(displayedCounts));
      const hasPendingCards = nextIndex <= lastVisibleIndex;
      frame = activeCounts.size || hasPendingCards ? requestAnimationFrame(animate) : undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === section) {
          sectionVisible = entry.isIntersecting;
        } else if (entry.intersectionRatio >= visibilityThreshold) {
          const index = cardIndexes.get(entry.target);
          if (index !== undefined) lastVisibleIndex = Math.max(lastVisibleIndex, index);
        }
      }

      if (!sectionVisible) {
        reset();
      } else if (!reducedMotion.matches && nextIndex <= lastVisibleIndex && frame === undefined) {
        frame = requestAnimationFrame(animate);
      }
    }, {threshold: [0, visibilityThreshold]});

    observer.observe(section);
    for (const card of cardIndexes.keys()) observer.observe(card);

    return () => {
      observer.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [spaces]);

  return (
    <ul className="home-spaces-served-grid" role="list" ref={gridRef}>
      {spaces.map(({count, label, icon}, index) => (
        <li key={label}>
          <div className="home-spaces-served-stat">
            <strong>
              <span className="home-spaces-served-count-text">{`${count}+`}</span>
              <span aria-hidden="true">{`${animatedCounts[index] ?? count}+`}</span>
            </strong>{' '}
            <svg className="home-spaces-served-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={icon} />
            </svg>
            <span className="home-spaces-served-label">{label}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

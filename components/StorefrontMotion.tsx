'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import './storefront-motion.css';

const headingTargets = [
  'main h1:not(.simple-hero h1)',
  '.section-heading h2',
  'section:not(.home-spaces-served) > h2',
  '.commerce-panel > h2',
  '.finder-intro h2',
].join(', ');

const copyTargets = [
  '[data-reveal-copy]',
  '.section-heading p',
  '.page-intro > .lede',
  '.hotel-guide-hub > header h1 + p',
  '.buyer-guide > header .buyer-answer',
  '.finder-intro h2 + p',
  'section:not(.simple-hero, .home-spaces-served) > :is(h1, h2) + p',
].join(', ');

const cardTargets = [
  '[data-reveal-card]',
  '.product-grid > .product-card',
  '.industry-grid > .industry-card',
  '.guide-card',
  '.space-choice-grid > .space-choice',
  '.finder-result',
].join(', ');

const imageTargets = [
  '[data-reveal-image]',
  '.detail-image',
  '.fragrance-detail-image',
  '.industry-banner',
  '.dealer-visual-photo',
  '.hotel-hub-image',
].join(', ');

const revealTargets = [headingTargets, copyTargets, cardTargets, imageTargets].join(', ');
const revealThreshold = 0.22;

function revealMotion(target: Element, height: number): { keyframes: Keyframe[]; duration: number } {
  if (target.matches(headingTargets)) {
    return { duration: 740, keyframes: [
      { clipPath: 'inset(-8px 100% -8px -8px)', opacity: 0.4 },
      { clipPath: 'inset(-8px -8px -8px -8px)', opacity: 1 },
    ] };
  }
  if (target.matches(copyTargets)) {
    return { duration: 580, keyframes: [
      { opacity: 0.12, translate: '-18px 0' },
      { opacity: 1, translate: '0 0' },
    ] };
  }
  if (target.matches(imageTargets)) {
    return { duration: 940, keyframes: [
      { clipPath: 'inset(100% 0 0 0 round 16px)', opacity: 0.55 },
      { clipPath: 'inset(0 0 0 0 round 16px)', opacity: 1 },
    ] };
  }
  const distance = Math.min(36, height * 0.14);
  return { duration: 760, keyframes: [
    { opacity: 0.28, translate: `0 ${distance}px`, scale: 0.96 },
    { opacity: 1, translate: '0 0', scale: 1 },
  ] };
}

export default function StorefrontMotion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const content = document.getElementById('main');
    if (window.location.hash || !content) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (pathname === '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof content.animate !== 'function') return;
    const animation = content.animate([
      { opacity: 0.72, transform: 'translateY(7px)' },
      { opacity: 1, transform: 'none' },
    ], { duration: 240, easing: 'cubic-bezier(.2,.65,.3,1)' });
    return () => animation.cancel();
  }, [pathname]);

  useEffect(() => {
    const content = document.getElementById('main');
    if (!content || !('IntersectionObserver' in window) || typeof content.animate !== 'function') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stopObserving: (() => void) | undefined;

    const updateMotionPreference = () => {
      stopObserving?.();
      stopObserving = reducedMotion.matches ? undefined : observeReveals(content);
    };

    updateMotionPreference();
    reducedMotion.addEventListener('change', updateMotionPreference);
    return () => {
      reducedMotion.removeEventListener('change', updateMotionPreference);
      stopObserving?.();
    };
  }, [pathname]);

  return null;
}

function observeReveals(content: HTMLElement) {
  const revealed = new Set<Element>();
  const animations = new Map<Element, Animation>();

  function cancelReveal(element: Element) {
    animations.get(element)?.cancel();
    animations.delete(element);
  }

  const observer = new IntersectionObserver((entries) => {
    let enteringCard = 0;
    for (const { target, isIntersecting, intersectionRatio, boundingClientRect } of entries) {
      if (!isIntersecting) {
        revealed.delete(target);
        cancelReveal(target);
        continue;
      }
      if (intersectionRatio < revealThreshold || revealed.has(target) || !content.contains(target)) continue;
      revealed.add(target);
      if (target.matches(':focus-within')) continue;

      const { keyframes, duration } = revealMotion(target, boundingClientRect.height);
      let delay = target.matches(copyTargets) ? 160 : 0;
      if (target.matches(cardTargets)) {
        delay = Math.min(enteringCard * 115, 460);
        enteringCard += 1;
      }
      const animation = target.animate(keyframes, {
        duration,
        delay,
        easing: 'cubic-bezier(.22,.64,.25,1)',
        fill: 'backwards',
      });
      animations.set(target, animation);
      animation.onfinish = () => animations.delete(target);
    }
  }, { threshold: [0, revealThreshold] });

  function visitTargets(node: Node, visit: (target: Element) => void) {
    if (!(node instanceof Element)) return;
    if (node.matches(revealTargets)) visit(node);
    node.querySelectorAll(revealTargets).forEach(visit);
  }

  const mutations = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.removedNodes) {
        if (content.contains(node)) continue;
        visitTargets(node, (target) => {
          observer.unobserve(target);
          revealed.delete(target);
          cancelReveal(target);
        });
      }
      for (const node of record.addedNodes) {
        if (content.contains(node)) visitTargets(node, (target) => observer.observe(target));
      }
    }
  });

  function showFocusedContent(event: FocusEvent) {
    const focused = event.target;
    if (!(focused instanceof Element)) return;
    for (const element of animations.keys()) {
      if (element.contains(focused)) cancelReveal(element);
    }
  }

  visitTargets(content, (target) => observer.observe(target));
  mutations.observe(content, { childList: true, subtree: true });
  content.addEventListener('focusin', showFocusedContent);

  return () => {
    observer.disconnect();
    observer.takeRecords();
    mutations.disconnect();
    content.removeEventListener('focusin', showFocusedContent);
    animations.forEach((animation) => animation.cancel());
  };
}

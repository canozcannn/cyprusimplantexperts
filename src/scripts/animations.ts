/**
 * Global animation system using Motion (motion.dev) v12
 * Handles: scroll-triggered fade/slide, stagger, counter, hero entrance
 */

import { animate as _animate, inView, stagger } from "motion";
import type { DOMKeyframesDefinition, AnimationOptions } from "motion";

// Typed wrapper to force TypeScript to resolve the DOM overload (not the generic object overload)
function animate(el: Element | Element[], keyframes: DOMKeyframesDefinition, options?: AnimationOptions) {
  return _animate(el, keyframes, options);
}

// ─── 1. Fade-up ───────────────────────────────────────────────────────────────
const fadeUpEls = document.querySelectorAll<HTMLElement>('[data-animate="fade-up"]');
fadeUpEls.forEach((el) => {
  const delay = parseFloat(el.dataset.animateDelay ?? "0") / 1000;
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";

  inView(
    el,
    () => {
      animate(el as Element, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] });
    },
    { amount: 0.15 },
  );
});

// ─── 2. Fade-in ───────────────────────────────────────────────────────────────
const fadeInEls = document.querySelectorAll<HTMLElement>('[data-animate="fade-in"]');
fadeInEls.forEach((el) => {
  const delay = parseFloat(el.dataset.animateDelay ?? "0") / 1000;
  el.style.opacity = "0";
  inView(
    el,
    () => {
      animate(el as Element, { opacity: [0, 1] }, { duration: 0.7, delay, ease: "easeOut" });
    },
    { amount: 0.2 },
  );
});

// ─── 3. Scale-in ─────────────────────────────────────────────────────────────
const scaleInEls = document.querySelectorAll<HTMLElement>('[data-animate="scale-in"]');
scaleInEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "scale(0.93) translateY(16px)";
  inView(
    el,
    () => {
      animate(
        el as Element,
        { opacity: [0, 1], scale: [0.93, 1], y: [16, 0] },
        { duration: 0.65, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] },
      );
    },
    { amount: 0.2 },
  );
});

// ─── 4. Stagger containers ───────────────────────────────────────────────────
const staggerContainers = document.querySelectorAll<HTMLElement>("[data-animate-stagger]");
staggerContainers.forEach((container) => {
  const children = Array.from(container.querySelectorAll<HTMLElement>(":scope > *"));
  children.forEach((child) => {
    child.style.opacity = "0";
    child.style.transform = "translateY(24px)";
  });

  inView(
    container,
    () => {
      animate(
        children as Element[],
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.55, delay: stagger(0.1, { startDelay: 0.1 }), ease: [0.22, 1, 0.36, 1] },
      );
    },
    { amount: 0.1 },
  );
});

// ─── 5. Slide-from-left ──────────────────────────────────────────────────────
const slideLeftEls = document.querySelectorAll<HTMLElement>('[data-animate="slide-left"]');
slideLeftEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateX(-32px)";
  inView(
    el,
    () => {
      animate(el as Element, { opacity: [0, 1], x: [-32, 0] }, { duration: 0.65, ease: [0.22, 1, 0.36, 1] });
    },
    { amount: 0.2 },
  );
});

// ─── 6. Slide-from-right ─────────────────────────────────────────────────────
const slideRightEls = document.querySelectorAll<HTMLElement>('[data-animate="slide-right"]');
slideRightEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateX(32px)";
  inView(
    el,
    () => {
      animate(el as Element, { opacity: [0, 1], x: [32, 0] }, { duration: 0.65, ease: [0.22, 1, 0.36, 1] });
    },
    { amount: 0.2 },
  );
});

// ─── 7. Number counter ───────────────────────────────────────────────────────
// animate(number, number) API changed in Motion v12 — use RAF instead
const counterEls = document.querySelectorAll<HTMLElement>("[data-counter]");
counterEls.forEach((el) => {
  const target = parseFloat(el.dataset.counter ?? "0");
  const prefix = el.dataset.counterPrefix ?? "";
  const suffix = el.dataset.counterSuffix ?? "";
  const DURATION = 1400;

  inView(
    el,
    () => {
      const startTime = performance.now();
      function tick(now: number) {
        const t = Math.min((now - startTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    { amount: 0.5 },
  );
});

// ─── 8. Hero entrance (one-shot on load) ─────────────────────────────────────
const heroCopy = document.querySelector<HTMLElement>("#top [data-hero-copy]");
if (heroCopy) {
  const items = Array.from(heroCopy.querySelectorAll<HTMLElement>("[data-hero-item]"));
  items.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
  });
  setTimeout(() => {
    animate(
      items as Element[],
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.6, delay: stagger(0.12, { startDelay: 0.1 }), ease: [0.22, 1, 0.36, 1] },
    );
  }, 80);
}

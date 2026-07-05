import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initReducedMotionLoop = (setup: () => (() => void) | void): () => void => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", setup);

  return () => {
    mm.revert();
  };
}

export const initFeaturesEntrance = (): () => void => {
  return initReducedMotionLoop(() => {
    const grid  = document.querySelector<HTMLElement>(".features-grid");
    const cards = gsap.utils.toArray<HTMLElement>(".feature-cell");

    if (!grid || !cards.length) return;

    const revealTween = gsap.from(cards, {
      opacity      : 0,
      y            : 16,
      duration     : 0.7,
      ease         : "power3.out",
      stagger      : 0.1,
      scrollTrigger: {
        trigger: grid,
        start  : "top 85%",
        once   : true,
      },
    });

    const hoverCleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const visual = card.querySelector<HTMLElement>(".feature-visual");
      const liftTo = gsap.quickTo(card, "y", {
        duration: 0.3,
        ease    : "power2.out",
      });
      const visualScaleTo = visual ? gsap.quickTo(visual, "scale", { duration: 0.3, ease: "power2.out" }) :  null;

      const onEnter = () => {
        liftTo(-4);
        visualScaleTo?.(1.02);
      };
      const onLeave = () => {
        liftTo(0);
        visualScaleTo?.(1);
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      hoverCleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      revealTween.scrollTrigger?.kill();
      revealTween.kill();
      hoverCleanups.forEach((off) => off());
      gsap.set(cards, { clearProps: "transform" });
      gsap.set(".feature-visual", { clearProps: "all" });
    };
  });
}

export const refreshScrollTrigger = (): void => {
  ScrollTrigger.refresh();
}

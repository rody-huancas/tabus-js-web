import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initCompatEntrance = (): (() => void) => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const items = gsap.utils.toArray<HTMLElement>(".compat-reveal");
    if (!items.length) return;

    const revealTween = gsap.from(items, {
      opacity      : 0,
      y            : 20,
      duration     : 0.7,
      ease         : "power3.out",
      stagger      : 0.15,
      scrollTrigger: {
        trigger: items[0],
        start  : "top 85%",
        once   : true,
      },
    });

    return () => {
      revealTween.scrollTrigger?.kill();
      revealTween.kill();
      gsap.set(items, { clearProps: "all" });
    };
  });

  return () => {
    mm.revert();
  };
};

export const refreshScrollTrigger = (): void => {
  ScrollTrigger.refresh();
};

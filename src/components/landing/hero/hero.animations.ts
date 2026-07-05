import { gsap } from "gsap";

export const initHeroAnimations = (): () => void => {
  document.documentElement.classList.remove("hero-anim-pending");

  const tl = gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.6 },
  });

  tl.from(".hero-badge", { opacity: 0, y: 20, duration: 0.5 })
    .from(
      ".hero-headline span",
      { opacity: 0, y: 48, stagger: 0.12, duration: 0.7 },
      "-=0.2",
    )
    .from(".hero-subhead", { opacity: 0, y: 30, duration: 0.6 }, "-=0.3")
    .from(".hero-ctas", { opacity: 0, y: 30, duration: 0.5 }, "-=0.35")
    .from(".hero-snippet", { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
    .from(
      ".hero-stats > *",
      { opacity: 0, y: 20, stagger: 0.08, duration: 0.4 },
      "-=0.25",
    )
    .from(
      ".hero-browser",
      {
        opacity : 0,
        y       : 60,
        scale   : 0.92,
        duration: 0.8,
        ease    : "power3.out",
      },
      "-=0.6",
    )
    .from(".hero-bubble", { opacity: 0, x: 30, y: -20, duration: 0.5 }, "-=0.4")
    .from(
      ".hero-code-card",
      { opacity: 0, x: -30, y: 20, duration: 0.5 },
      "-=0.35",
    )
    .from(".hero-event", { opacity: 0, x: -20, duration: 0.4 }, "-=0.2")
    .from(".hero-event-2", { opacity: 0, x: -20, duration: 0.4 }, "-=0.25")
    .from(".hero-scroll", { opacity: 0, duration: 0.4 }, "-=0.1");

  const bumpCounter = () => {
    const counter = document.querySelector<HTMLElement>(".hero-counter");
    if (!counter) return;
    const current             = parseInt(counter.textContent ?? "3", 10) || 3;
          counter.textContent = String(current >= 9 ? 3 : current + 1);
  };

  const loopTl = gsap.timeline({
    repeat     : -1,
    repeatDelay: 1.4,
    paused     : true,
    defaults   : { ease: "power2.inOut" },
  });

  loopTl
    .to(".hero-event", { scale: 1.04, duration: 0.25 })
    .to(".hero-event", { scale: 1, duration: 0.25 })
    .call(bumpCounter)
    .fromTo(
      ".hero-progress",
      { width: "70%" },
      { width: "100%", duration: 0.7 },
      "<",
    )
    .to(
      ".hero-event-2",
      { boxShadow: "0 0 0 2px var(--color-accent)", duration: 0.2 },
      "-=0.2",
    )
    .to(".hero-event-2", {
      boxShadow: "0 0 0 0px var(--color-accent)",
      duration : 0.5,
      delay    : 0.3,
    })
    .to(".hero-bubble", { scale: 1.05, duration: 0.3 }, "-=0.6")
    .to(".hero-bubble", { scale: 1, duration: 0.35 })
    .to(".hero-progress", { width: "70%", duration: 0.4 }, "+=0.6");

  tl.eventCallback("onComplete", () => loopTl.play());

  return () => {
    tl.kill();
    loopTl.kill();
  };
}

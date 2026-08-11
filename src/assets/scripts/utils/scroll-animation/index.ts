import { animations, showImmediately } from "./animation";

export class ScrollAnimation {
  private elements: HTMLElement[] = [];
  constructor() {
    const els = document.querySelectorAll<HTMLElement>("[data-scroll-animation]");
    this.elements = Array.from(els);
    this.initCheck();
    this.observe();
  }

  private initCheck() {
    this.elements = this.elements.filter((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        showImmediately(el);
        return false;
      }
      return true;
    });
  }

  private observe() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const type = el.dataset.scrollAnimation;
            if (!type) return;
            const animateFn = animations[type];
            animateFn?.(el);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    this.elements.forEach((el) => {
      observer.observe(el);
    });
  }
}

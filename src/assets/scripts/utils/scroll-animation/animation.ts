import gsap from "gsap";

export function showImmediately(el: HTMLElement) {
  gsap.set(el, { opacity: 1 });
  el.classList.add("is-active");
}

export function fadeInAnimation(el: HTMLElement) {
  gsap.to(el, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    onComplete() {
      el.classList.add("is-active");
    },
  });
}

export const animations: Record<string, (el: HTMLElement) => void> = {
  fade: fadeInAnimation,
};

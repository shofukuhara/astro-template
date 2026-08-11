import gsap from "gsap";

interface AnimationElements {
  menu: HTMLDialogElement;
  openButton: HTMLElement;
  closeButton: HTMLElement;
}

export function openMenuAnimation(els: AnimationElements) {
  const { menu } = els;
  gsap.fromTo(
    menu,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }
  );
}

export function closeMenuAnimation(els: AnimationElements, onComplete: () => void) {
  const { menu } = els;
  gsap.fromTo(
    menu,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete,
    }
  );
}

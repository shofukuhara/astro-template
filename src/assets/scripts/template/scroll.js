import gsap from "gsap";

export class ScrollAnimation {
  constructor(options = { threshold: 0, rootMargin: "0px" }) {
    this.observers = [];
    this.options = options;

    this.animations = [
      {
        attr: "data-scroll-fade",
        animate: (target, observer) => {
          gsap.to(target, {
            ease: "power4.out",
            duration: 2,
            autoAlpha: 1,
            onComplete: () => {
              target.setAttribute("data-scroll-fade", "active");
              observer.unobserve(target);
            },
          });
        },
        observerOptions: {
          rootMargin: "0px 0px 0px 0px",
          threshold: 0.55,
        },
      },
      // {
      //   attr: "data-scroll-slide",
      //   staggerSelector: "[data-item]", // stagger対象のセレクタ
      //   staggerDelay: 0.1, // staggerの間隔
      //   animate: (target, observer) => {
      //     const items = target.querySelectorAll("[data-item]");
      //     if (items.length > 0) {
      //       // 子要素がある場合はstagger
      //       gsap.to(items, {
      //         x: 0,
      //         opacity: 1,
      //         duration: 0.8,
      //         ease: "power2.out",
      //         stagger: 0.1,
      //         onComplete: () => {
      //           target.setAttribute("data-scroll-slide", "active");
      //           observer.unobserve(target);
      //         },
      //       });
      //     } else {
      //       // 子要素がない場合は通常のアニメーション
      //       gsap.to(target, {
      //         x: 0,
      //         opacity: 1,
      //         duration: 0.8,
      //         ease: "power2.out",
      //         onComplete: () => {
      //           target.setAttribute("data-scroll-slide", "active");
      //           observer.unobserve(target);
      //         },
      //       });
      //     }
      //   },
      //   observerOptions: {
      //     rootMargin: "-10% 0px",
      //     threshold: 0.3,
      //   },
      // },
    ];
  }

  _initVisibility() {
    window.addEventListener("DOMContentLoaded", () => {
      const scrollY = window.scrollY;
      this.animations.forEach(({ attr }) => {
        document.querySelectorAll(`[${attr}]`).forEach((element) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          if (elementTop < scrollY) {
            gsap.set(element, { autoAlpha: 1 });
            element.setAttribute(attr, "active");
          }
        });
      });
    });
  }

  _handleIntersect(entries, observer, animateFn, attr) {
    entries.forEach((entry) => {
      const target = entry.target;

      if (entry.isIntersecting) {
        const scrollY = window.scrollY;
        const elementTop = target.getBoundingClientRect().top + scrollY;

        if (elementTop > scrollY && target.hasAttribute(attr)) {
          animateFn(target, observer);
        }
      }
    });
  }

  _createObserver(attr, animateFn, options = {}) {
    const observer = new IntersectionObserver((entries, obs) => this._handleIntersect(entries, obs, animateFn, attr), {
      ...this.options,
      ...options,
    });

    document.querySelectorAll(`[${attr}]`).forEach((element) => {
      observer.observe(element);
    });

    this.observers.push(observer);
  }

  init() {
    this._initVisibility();

    this.animations.forEach(({ attr, animate, observerOptions }) => {
      this._createObserver(attr, animate, observerOptions);
    });
  }

  // destroy() {
  //   this.observers.forEach((observer) => observer.disconnect());
  // }
}

import { closeMenuAnimation, openMenuAnimation } from "./animation";

interface MenuDom {
  menu: HTMLDialogElement;
  openButton: HTMLElement;
  closeButton: HTMLElement;
}

export class Menu {
  private dom: MenuDom | null = null;
  private scrollY: number = 0;
  constructor() {
    const menu = document.querySelector<HTMLDialogElement>("[data-menu]");
    const openButton = document.querySelector<HTMLElement>("[data-menu-open]");
    const closeButton = document.querySelector<HTMLElement>("[data-menu-close]");

    if (!menu || !openButton || !closeButton) return;

    this.dom = { menu, openButton, closeButton };
    this.addEvents();
  }

  private open() {
    if (!this.dom) return;
    this.dom.menu.showModal();
    this.dom.openButton.setAttribute("aria-expanded", "true");
    this.fixScroll();
    openMenuAnimation(this.dom);
  }

  private close() {
    if (!this.dom) return;
    closeMenuAnimation(this.dom, () => {
      this.releaseScroll();
      this.dom?.menu.close();
      this.dom?.openButton.focus();
      this.dom?.openButton.setAttribute("aria-expanded", "false");
    });
  }

  private addEvents() {
    // 開閉ボタン
    this.dom?.openButton.addEventListener("click", () => this.open());
    this.dom?.closeButton.addEventListener("click", () => this.close());

    // オーバーレイクリック
    this.dom?.menu.addEventListener("click", (e) => {
      if (e.target === this.dom?.menu) this.close();
    });

    // ESCキー
    this.dom?.menu.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
    });
  }

  private fixScroll() {
    this.scrollY = window.scrollY;
    document.body.style.cssText = `
    position: fixed;
    top: -${this.scrollY}px;
    left: 0;
  `;
  }

  private releaseScroll() {
    document.body.style.cssText = "";
    window.scrollTo(0, this.scrollY);
  }
}

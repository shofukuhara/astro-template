export class ViewportManager {
  constructor() {
    this._handleResize = this._handleResize.bind(this);
  }

  init() {
    this._updateViewportSize();
    window.addEventListener("resize", this._handleResize);
  }

  destroy() {
    window.removeEventListener("resize", this._handleResize);
  }

  _handleResize() {
    this._updateViewportSize();
  }

  _updateViewportSize() {
    document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
    document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
  }
}

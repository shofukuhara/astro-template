export class Breakpoint {
  constructor(callback) {
    this.breakpoint = "768px";
    this.callback = callback;
    this.mediaQueryList = null;
    this.init();
  }

  init() {
    this.mediaQueryList = window.matchMedia(`(min-width: ${this.breakpoint})`);
    this.mediaQueryList.addEventListener("change", this.handleChange.bind(this));
    // 初回実行
    this.handleChange(this.mediaQueryList);
  }

  handleChange(e) {
    if (e.matches) {
      this.callback(true); // pc（768.9px以上）
    } else {
      this.callback(false); // sp（768px以下）
    }
  }
}

new Breakpoint((isPC) => {
  if (isPC) {
    console.log("PCブレイクポイントを超えました！（769px以上）");
  } else {
    console.log("PCブレイクポイント以下になりました！（768px以下）");
  }
});

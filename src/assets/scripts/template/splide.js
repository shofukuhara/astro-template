import Splide from "@splidejs/splide";
import "@splidejs/splide/css/core";

export class SplideSlide {
  constructor() {
    this.targets = document.querySelectorAll(".splide");
    this.instances = [];
    this.options = {
      type: "loop",
      rewind: true,
      perPage: 1,
      arrows: false,
      pagination: false,
      speed: 1000,
      easing: "linear",
      // 自動再生
      // autoplay: true,
      // interval: 4000,
      // PC時はスライド無効、SP時だけスライド
      // mediaQuery: "min",
      // breakpoints: {
      //   768: {
      //     destroy: true,
      //   },
      // },
    };
  }

  init() {
    // this.targetsなければ何もしない
    if (!this.targets.length) return;
    this.targets.forEach((el) => {
      const splide = new Splide(el, this.options);

      // イベント設定
      // this.setupEvents(splide);

      splide.mount();
      this.instances.push(splide);
    });
  }

  setupEvents(splide) {
    // スライド移動時
    splide.on("move", (newIndex, prevIndex, destIndex) => {
      // console.log(`移動: ${prevIndex} → ${newIndex}`);
    });

    // スライド移動完了時
    splide.on("moved", (newIndex, prevIndex, destIndex) => {
      // console.log(`移動完了: ${newIndex}`);
    });

    // マウント完了時
    splide.on("mounted", () => {
      // console.log("マウント完了");
    });

    // リサイズ時
    splide.on("resized", () => {
      // console.log("リサイズ");
    });

    // 自動再生開始時
    splide.on("autoplay:playing", () => {
      // console.log("自動再生中");
    });

    // 自動再生停止時
    splide.on("autoplay:pause", () => {
      // console.log("自動再生停止");
    });

    // スライドクリック時
    splide.on("click", (slide, e) => {
      // console.log("スライドクリック", slide.index);
    });

    // ドラッグ開始時
    splide.on("drag", () => {
      // console.log("ドラッグ中");
    });

    // destroy時
    splide.on("destroy", () => {
      // console.log("destroy実行");
    });
  }

  // // 全インスタンスを破棄
  // destroy() {
  //   this.instances.forEach((splide) => {
  //     if (splide) splide.destroy();
  //   });
  //   this.instances = [];
  // }

  // // 特定のスライドに移動
  // goTo(index, instanceIndex = 0) {
  //   if (this.instances[instanceIndex]) {
  //     this.instances[instanceIndex].go(index);
  //   }
  // }
}

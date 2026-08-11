import { UAParser } from "ua-parser-js";

export class UserAgentParser {
  constructor() {
    this.parser = new UAParser();
    this.ua = {
      os: this.parser.getOS(),
      browser: this.parser.getBrowser(),
      device: this.parser.getDevice(),
    };
    this.data = {
      os: document.querySelector("[data-os]"),
      browser: document.querySelector("[data-browser]"),
      device: document.querySelector("[data-device]"),
    };
  }

  init() {
    this.os = this.ua.os;
    this.browser = this.ua.browser;
    this.device = this.ua.device;
    this.dataSet();
  }

  getOS() {
    return this.os.name || "Unknown OS";
  }

  getBrowser() {
    return this.browser.name || "Unknown Browser";
  }

  getDevice() {
    if (this.device.model) return this.device.model;
    if (this.device.type) return this.device.type;
    return "Desktop";
  }

  dataSet() {
    if (this.data.os) {
      this.data.os.setAttribute("data-os", this.getOS());
    }
    if (this.data.browser) {
      this.data.browser.setAttribute("data-browser", this.getBrowser());
    }
    if (this.data.device) {
      this.data.device.setAttribute("data-device", this.getDevice());
    }
  }
}

// const ua = new UAParserUtils();
// ua.init();

// if (ua.getOS() === "macOS") {
//   console.log("Macユーザー");
// }

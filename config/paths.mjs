import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// .env.production を読み込む
dotenv.config({ path: ".env.production" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// 基本設定
// ============================
export const OUT_DIR = process.env.OUT_DIR ?? "dist";

// ============================
// パス設定
// ============================
export const PATHS = {
  // 出力パス（ビルド後のファイル配置）
  output: {
    scriptDir: "assets/script",
    styleDir: "assets/style",
    js: "assets/script/index.js",
    css: "assets/style/index.css",
    license: "assets/script/license.txt",
  },

  // ソースパス
  src: {
    styles: "/src/assets/styles/settings/index.scss",
  },

  // 画像処理パス
  images: {
    input: path.join(__dirname, "../images/original"),
    output: path.join(__dirname, "../images/compressed"),
  },
};

// ============================
// ビルド設定
// ============================
export const BUILD_CONFIG = {
  // ライセンスバナー
  licenseBanner: "/*! For license information please see license.txt */\n",

  // 画像圧縮設定
  imageCompression: {
    format: "webp", // 'webp' | 'avif' | 'both'
    quality: 80,
    copySvg: true,
    cleanOutput: true,
  },
};

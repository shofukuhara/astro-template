import { defineConfig } from "astro/config";
import path from "node:path";
import license from "rollup-plugin-license";
import { OUT_DIR, PATHS } from "./config/paths.mjs";

export default defineConfig({
  outDir: OUT_DIR,

  // 開発サーバーの設定
  server: {
    host: true,
    port: 5963,
    open: true,
    // open: "/", // ルートを開く
  },

  // astroのビルド設定
  build: {
    inlineStylesheets: "never", // すべてのCSSをcssファイルに出力する
    cssCodeSplit: false, // CSSをひとつのファイルにまとめる
  },

  // HTMLの圧縮を無効にする
  compressHTML: false,

  vite: {
    css: {
      postcss: "postcss.config.cjs",
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${PATHS.src.styles}" as *;`,
        },
      },
    },
    plugins: [
      license({
        thirdParty: {
          output: path.join(OUT_DIR, PATHS.output.license),
          includePrivate: false,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      cssMinify: true,
      cssCodeSplit: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        // 基本的にcss以外はpublic管理なのでcssだけ設定
        output: {
          assetFileNames: ({ names }) => {
            const ext = names[0].split(".").at(-1);
            if (/css|scss/i.test(ext)) {
              return `${PATHS.output.css}`;
            }
          },
        },
      },
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              // jsファイルは常にindex.jsとして出力する
              entryFileNames: `${PATHS.output.js}`,
            },
          },
        },
      },
    },
  },
});

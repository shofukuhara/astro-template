import { promises as fs } from "fs";
import path from "path";
import { BUILD_CONFIG, OUT_DIR, PATHS } from "./paths.mjs";

// ============================
// 設定エリア
// ============================
const config = {
  basePath: `${OUT_DIR}/${PATHS.output.scriptDir}`,
  banner: BUILD_CONFIG.licenseBanner,
};

// ============================
// 実行部分
// ============================
const distJsPath = path.join(process.cwd(), config.basePath);

try {
  const files = await fs.readdir(distJsPath);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const fullPath = path.join(distJsPath, file);
    const content = await fs.readFile(fullPath, "utf-8");

    if (!content.startsWith("/*!")) {
      await fs.writeFile(fullPath, config.banner + content);
      console.log(`✅ ライセンステキスト追加: ${file}`);
    } else {
      console.log(`ℹ️ すでにライセンステキストあり: ${file}`);
    }
  }

  console.log("🎉 全ファイルのチェックが完了しました！");
} catch (err) {
  console.error("💥 JS処理中にエラー発生:", err);
}

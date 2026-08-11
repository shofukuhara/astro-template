import fs from "fs/promises";
import sharp from "sharp";
import { optimize } from "svgo";
import { BUILD_CONFIG, PATHS } from "./paths.mjs";

// ========================================
// 設定
// ========================================
const CONFIG = {
  inputDir: PATHS.images.input,
  outputDir: PATHS.images.output,
  ...BUILD_CONFIG.imageCompression,
};

// ========================================
// バリデーション
// ========================================
const VALID_FORMATS = ["webp", "avif", "both"];

function validateConfig() {
  if (!VALID_FORMATS.includes(CONFIG.format)) {
    throw new Error(`format の値が不正です: "${CONFIG.format}" → "webp" | "avif" | "both" のいずれかを指定してください`);
  }
}

// ========================================
// メイン処理
// ========================================
async function compressImages() {
  console.log("🚀 画像圧縮を開始します...\n");

  validateConfig();

  console.log(`📁 入力: ${CONFIG.inputDir}`);
  console.log(`📁 出力: ${CONFIG.outputDir}`);
  console.log(`🎨 形式: ${CONFIG.format}`);
  console.log(`💎 品質: ${CONFIG.quality}`);
  console.log(`🧹 出力クリア: ${CONFIG.cleanOutput}\n`);

  // 入力ディレクトリの存在チェック
  try {
    await fs.access(CONFIG.inputDir);
  } catch {
    console.error(`❌ 画像フォルダが見つかりません: ${CONFIG.inputDir}`);
    console.error(`📂 "${CONFIG.inputDir}" に画像を入れてから再実行してください`);
    process.exit(1);
  }

  try {
    if (CONFIG.cleanOutput) {
      await fs.rm(CONFIG.outputDir, { recursive: true, force: true });
    }
    await fs.mkdir(CONFIG.outputDir, { recursive: true });

    await processDirectory(CONFIG.inputDir, CONFIG.outputDir);

    console.log("\n✅ 画像圧縮が完了しました！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

// ========================================
// ディレクトリを再帰的に処理
// ========================================
async function processDirectory(inputDir, outputDir) {
  const entries = await fs.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(outputPath, { recursive: true });
      await processDirectory(inputPath, outputPath);
    } else if (entry.isFile()) {
      await processFile(inputPath, outputDir, entry.name);
    }
  }
}

// ========================================
// ファイルを処理
// ========================================
async function processFile(inputPath, outputDir, filename) {
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext);

  // SVG
  if (ext === ".svg") {
    if (CONFIG.copySvg) {
      try {
        const svgContent = await fs.readFile(inputPath, "utf-8");
        const result = optimize(svgContent, {
          multipass: true,
          plugins: ["preset-default", "sortAttrs", "removeDimensions"],
        });
        const outputPath = path.join(outputDir, filename);
        await fs.writeFile(outputPath, result.data);
        console.log(`🎨 SVG最適化: ${filename}`);
      } catch (error) {
        console.error(`❌ SVG最適化失敗: ${filename}`, error.message);
      }
    }
    return;
  }

  // GIF はアニメーション非対応のためスキップ
  if (ext === ".gif") {
    console.log(`⏭️  スキップ: ${filename} (GIF はアニメーション非対応のため除外)`);
    return;
  }

  // 対応している画像形式かチェック
  const supportedFormats = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".tif"];
  if (!supportedFormats.includes(ext)) {
    console.log(`⏭️  スキップ: ${filename} (非対応形式)`);
    return;
  }

  try {
    // インスタンスは1度だけ生成
    const image = sharp(inputPath);

    if (CONFIG.format === "webp" || CONFIG.format === "both") {
      const webpPath = path.join(outputDir, `${basename}.webp`);
      await image.clone().webp({ quality: CONFIG.quality }).toFile(webpPath);
      console.log(`✨ WebP作成: ${basename}.webp`);
    }

    if (CONFIG.format === "avif" || CONFIG.format === "both") {
      const avifPath = path.join(outputDir, `${basename}.avif`);
      await image.clone().avif({ quality: CONFIG.quality }).toFile(avifPath);
      console.log(`✨ AVIF作成: ${basename}.avif`);
    }
  } catch (error) {
    console.error(`❌ 圧縮失敗: ${filename}`, error.message);
  }
}

// ========================================
// 実行
// ========================================
compressImages();

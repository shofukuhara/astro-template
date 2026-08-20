import { promises as fs } from "fs";
import path from "path";
import { OUT_DIR } from "./paths.mjs";

// ============================
// 設定エリア
// ============================
const config = {
  distDir: OUT_DIR,
  targetPatterns: [
    // script タグの src 属性
    /(<script[^>]+src=["'])\/assets\//g,
    // link タグの href 属性
    /(<link[^>]+href=["'])\/assets\//g,
    // img タグの src 属性（必要に応じて）
    /(<img[^>]+src=["'])\/assets\//g,
  ],
};

// ============================
// 関数定義
// ============================

/**
 * HTMLファイルを再帰的に検索
 */
async function findHtmlFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await findHtmlFiles(fullPath, fileList);
    } else if (file.name.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * ファイルの階層深度を計算（distディレクトリからの相対位置）
 */
function calculateDepth(filePath, baseDir) {
  const relative = path.relative(baseDir, path.dirname(filePath));
  if (!relative || relative === ".") return 0;
  return relative.split(path.sep).length;
}

/**
 * 絶対パスを相対パスに変換
 */
function convertToRelativePath(content, depth) {
  let modifiedContent = content;
  const prefix = depth === 0 ? "./" : "../".repeat(depth);

  for (const pattern of config.targetPatterns) {
    modifiedContent = modifiedContent.replace(pattern, `$1${prefix}assets/`);
  }

  return modifiedContent;
}

// ============================
// 実行部分
// ============================
const distPath = path.join(process.cwd(), config.distDir);

try {
  console.log("🔍 HTMLファイルを検索中...");
  const htmlFiles = await findHtmlFiles(distPath);

  if (htmlFiles.length === 0) {
    console.log("⚠️ HTMLファイルが見つかりませんでした");
    process.exit(0);
  }

  console.log(`📄 ${htmlFiles.length}個のHTMLファイルを発見\n`);

  let modifiedCount = 0;

  for (const filePath of htmlFiles) {
    const depth = calculateDepth(filePath, distPath);
    const relativePath = path.relative(distPath, filePath);

    let content = await fs.readFile(filePath, "utf-8");
    const originalContent = content;

    content = convertToRelativePath(content, depth);

    if (content !== originalContent) {
      await fs.writeFile(filePath, content, "utf-8");
      const prefix = depth === 0 ? "./" : "../".repeat(depth);
      console.log(`✅ ${relativePath} (階層: ${depth}, パス: ${prefix}assets/)`);
      modifiedCount++;
    } else {
      console.log(`ℹ️  ${relativePath} (変更なし)`);
    }
  }

  console.log(`\n🎉 完了: ${modifiedCount}/${htmlFiles.length} ファイルを更新しました`);
} catch (err) {
  console.error("💥 処理中にエラー発生:", err);
  process.exit(1);
}

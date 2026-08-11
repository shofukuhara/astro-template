/**
 * ページの階層に応じて assets への相対パスを取得
 * @param pathname - Astro.url.pathname
 * @returns 相対パスのプレフィックス（例: "./", "../", "../../"）
 */
export function getRelativePrefix(pathname: string): string {
  const depth = pathname.split("/").filter(Boolean).length;
  return depth > 0 ? "../".repeat(depth) : "./";
}

/**
 * ページの階層に応じて画像ディレクトリへのパスを取得
 * @param pathname - Astro.url.pathname
 * @returns 画像ディレクトリへの相対パス
 */
export function getImageBasePath(pathname: string): string {
  return getRelativePrefix(pathname) + "assets/images/";
}

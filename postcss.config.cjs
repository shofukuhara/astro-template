/**
 * PostCSS 設定
 *
 * autoprefixer
 *   ベンダープレフィックスを自動付与する
 *
 * css-declaration-sorter
 *   CSSプロパティをSMACSSの順序で自動整列する
 *
 * postcss-sort-media-queries
 *   メディアクエリをモバイルファーストの順序で並び替える
 *
 * postcss-combine-media-query
 *   同じブレークポイントのメディアクエリをひとつにまとめる
 *
 * postcss-merge-rules
 *   同じセレクタのルールをひとつにまとめる
 */
module.exports = {
  plugins: [
    require("autoprefixer")(),
    require("css-declaration-sorter")({
      order: "smacss",
    }),
    require("postcss-sort-media-queries")({
      sort: "mobile-first",
    }),
    require("postcss-combine-media-query")(),
    require("postcss-merge-rules")(),
  ],
};

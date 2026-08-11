# Project

Astro製の静的サイト構築テンプレートです。

## 必要環境

- Node.js `>=22.12.0`（推奨: `22.12.0` / Volta使用時は自動切替）

## セットアップ

```bash
# パッケージインストール
npm install

# 環境変数ファイルを作成
cp .env.example .env.production
```

`.env.production` を開き、納品ディレクトリを設定してください。

```
# 例: dist / htdocs / htdocs/project/name
OUT_DIR=dist
```

> `.env.production` は `.gitignore` に含まれているため、Git管理外です。

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（ポート: `2222`）|
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint:css` | CSSのLintチェック |
| `npm run format` | コードフォーマット |
| `npm run compressedImage` | 画像の圧縮（後述）|

## ビルド

```bash
npm run build
```

ビルド時に以下が自動で実行されます。

1. CSSのLintチェック（stylelint）
2. Astroのビルド
3. コードフォーマット（Prettier）
4. JSファイルへのライセンスバナー付与

出力先は `.env.production` の `OUT_DIR` に従います。

## 画像圧縮

画像圧縮は開発サーバーとは独立したスクリプトです。必要なときだけ手動で実行してください。

### 手順

1. `images/original/` に圧縮したい画像を入れる
2. 以下を実行する

```bash
npm run compressedImage
```

3. `images/compressed/` に圧縮後の画像が出力される

### 対応形式

| 入力 | 出力 |
|---|---|
| `.jpg` `.jpeg` `.png` `.webp` `.avif` `.tiff` | WebP / AVIF（設定による）|
| `.svg` | SVGのまま最適化してコピー |
| `.gif` | スキップ（アニメーション非対応）|

### 設定変更

`config/_compressed-images.mjs` の `CONFIG` を編集してください。

```js
const CONFIG = {
  // 出力形式: 'webp' | 'avif' | 'both'
  format: "avif",

  // 圧縮品質 (1〜100)
  quality: 80,

  // SVGを最適化してコピーするか
  copySvg: true,

  // trueにすると実行のたびに compressed/ をリセットする
  cleanOutput: true,
};
```

## CSS設計

PostCSSによって以下の処理がビルド時に自動で行われます。

- **autoprefixer** — ベンダープレフィックスの自動付与
- **css-declaration-sorter** — CSSプロパティをSMACSSの順序で整列
- **postcss-sort-media-queries** — メディアクエリをモバイルファースト順に並び替え
- **postcss-combine-media-query** — 同じブレークポイントのメディアクエリを結合
- **postcss-merge-rules** — 同一セレクタのルールをひとつにまとめる

stylelintでSCSSおよびAstroファイルの構文チェックを行っています。

## パスエイリアス

`@` が `src/` に対応しています。

```js
import something from "@/components/something.astro";
```

## ディレクトリ構成

```
.
├── config/                              # 各種スクリプト
│   ├── _add-license.mjs                 # JSへのライセンスバナー付与スクリプト
│   └── _compressed-min.mjs              # 画像圧縮スクリプト
│
├── images/                              # 画像圧縮用ディレクトリ
│   ├── original/                        # 圧縮前の画像を入れる
│   └── compressed/                      # 圧縮後の画像が出力される（自動生成）
│
├── public/                              # 静的ファイル（ビルド時にそのままコピーされる）
│   └── assets/
│       └── images/                      # 公開用画像ファイル
│
├── src/                                 # ソースファイル
│   ├── assets/                          # アセットファイル（ビルド時に処理される）
│   │   ├── scripts/                     # JavaScriptファイル
│   │   │   ├── index.js                 # JSのエントリーポイント
│   │   │   ├── pages/                   # ページ固有のスクリプト
│   │   │   ├── template/                # 汎用テンプレートスクリプト
│   │   │   │   ├── scroll.js            # スクロール関連の処理
│   │   │   │   └── splide.js            # スライダーライブラリの初期化
│   │   │   └── utils/                   # ユーティリティ関数
│   │   │       ├── breakpoint.js        # ブレークポイント判定
│   │   │       ├── userAgentParser.js   # ユーザーエージェント解析
│   │   │       └── viewportManager.js   # ビューポート管理
│   │   │
│   │   └── styles/                      # SCSSファイル
│   │       ├── index.scss               # スタイルのエントリーポイント
│   │       ├── global/                  # グローバルスタイル
│   │       │   ├── _base.scss           # ベーススタイル
│   │       │   ├── _reset.scss          # リセットCSS
│   │       │   └── index.scss           # グローバルスタイルのインデックス
│   │       └── settings/                # 設計設定
│   │           ├── _color.scss          # カラー変数
│   │           ├── _easings.scss        # イージング関数
│   │           ├── _font.scss           # フォント設定
│   │           ├── _function.scss       # SCSS関数
│   │           ├── _mixin.scss          # SCSSミックスイン
│   │           ├── _root.scss           # ルート変数
│   │           ├── _viewport.scss       # ビューポート関連
│   │           └── index.scss           # 設定のインデックス
│   │
│   ├── components/                      # Astroコンポーネント
│   │   ├── common/                      # 共通コンポーネント
│   │   │   ├── Footer.astro             # フッター
│   │   │   ├── Head.astro               # HTMLヘッド（メタタグなど）
│   │   │   └── Header.astro             # ヘッダー
│   │   ├── elements/                    # 基本要素コンポーネント
│   │   │   ├── Picture.astro            # 画像表示コンポーネント
│   │   │   └── Title .astro             # タイトルコンポーネント
│   │   ├── sections/                    # セクションコンポーネント
│   │   │   ├── about/                   # Aboutページ用セクション
│   │   │   └── home/                    # ホームページ用セクション
│   │   └── ui/                          # UIコンポーネント
│   │       ├── Button.astro             # ボタン
│   │       ├── Button02.astro           # ボタン（別バリエーション）
│   │       ├── Card.astro               # カード
│   │       └── Slide.astro              # スライド
│   │
│   ├── data/                            # JSONデータファイル
│   │   ├── external.json                # 外部リンクなどのデータ
│   │   └── meta.json                    # メタ情報データ
│   │
│   ├── layouts/                         # レイアウトコンポーネント
│   │   └── Base.astro                   # ベースレイアウト
│   │
│   └── pages/                           # ページファイル（ルーティング）
│       ├── index.astro                  # トップページ
│       ├── _about/                      # Aboutページ
│       │   └── index.astro
│       └── _list/                       # 一覧ページ
│           └── index.astro
│
├── .env.example                         # 環境変数のテンプレート
├── .env.production                      # 環境変数（Git管理外）
├── astro.config.mjs                     # Astro設定ファイル
├── postcss.config.cjs                   # PostCSS設定ファイル
├── tsconfig.json                        # TypeScript設定ファイル
└── package.json                         # npm設定ファイル
```

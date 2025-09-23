# AI競馬予想システム

SvelteKit + Hono + Cloudflare で構築する競馬予想システム

## 技術スタック

- **Frontend**: SvelteKit (Cloudflare Pages)
- **Backend**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1
- **Package Manager**: pnpm (モノレポ構成)

## プロジェクト構成

```
ai-keiba/
├── apps/
│   ├── web/        # SvelteKit フロントエンド
│   └── api/        # Hono API サーバー
└── packages/       # 共有パッケージ（今後追加予定）
```

## セットアップ

### インストール


```bash
# node 環境の構築
brew update && brew upgrade node-build
NODE_VERSION=$(cat .node-version)
nodenv install $NODE_VERSION
npm install -g pnpm@$(node -p "require('./package.json').engines.pnpm")

# 依存性のインストール
pnpm i
```

## 開発

### ローカル開発サーバーの起動

```bash
# 全てのアプリを起動（フロントエンド + API）
pnpm dev

# 個別起動
pnpm --filter @ai-keiba/web dev    # フロントエンドのみ
pnpm --filter @ai-keiba/api dev    # APIのみ
```

### アクセスURL

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8787

## ビルド

```bash
# 全体のビルド
pnpm build

# 個別ビルド
pnpm --filter @ai-keiba/web build
pnpm --filter @ai-keiba/api build
```

## デプロイ

### Frontend (Cloudflare Pages)

1. Cloudflare Dashboard でプロジェクトを作成
2. GitHub リポジトリと連携
3. ビルド設定：
   - Build command: `pnpm --filter @ai-keiba/web build`
   - Build output directory: `apps/web/.svelte-kit/cloudflare`
   - Root directory: `/`

### API (Cloudflare Workers)

```bash
# APIのデプロイ
pnpm --filter @ai-keiba/api deploy
```

## D1 データベースセットアップ

```bash
# データベース作成
wrangler d1 create ai-keiba-db

# wrangler.toml に設定を追加
# database_id を実際のIDに置き換えてください
```

## 環境変数

`.env.example` を参考に `.env` ファイルを作成してください。

## ライセンス

Private
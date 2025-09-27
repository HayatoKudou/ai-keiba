# AI競馬予想システム

SvelteKit + Hono + Cloudflare で構築する競馬予想システム

## 技術スタック

- **Frontend**: SvelteKit (Cloudflare Pages)
- **Backend**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1

## プロジェクト構成

```
ai-keiba/
└── apps/
    ├── web/        # SvelteKit フロントエンド
    └── api/        # Hono API サーバー
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

### データベースセットアップ

TODO

## 開発

### ローカル開発サーバーの起動

```bash
# 全てのアプリを起動（フロントエンド + API）
pnpm dev
```

## デプロイ

### Frontend (Cloudflare Pages)

mainブランチにマージ

### API (Cloudflare Workers)

TODO

# 技術コンテキスト: cft

## 技術スタック

### コア技術
- **言語**: TypeScript
- **ランタイム**: Bun
- **開発環境**: VSCode, Devbox
- **CI/CD**: GitHub Actions

### 主要な依存関係
```json
{
  "name": "@suin/cft",
  "version": "1.0.0",
  "module": "src/index.ts",
  "type": "module",
  "bin": {
    "cft": "./cft"
  }
}
```

## 開発環境セットアップ

### 必要なツール
1. **Bun**
   - JavaScriptランタイム
   - パッケージマネージャー
   - TypeScriptコンパイラ
   - クロスプラットフォームビルド

2. **VSCode**
   - 推奨される開発IDE
   - TypeScriptサポート
   - デバッグ機能

3. **Devbox**
   - 開発環境の一貫性確保
   - ビルドプロセスの標準化
   - 依存関係の管理

### 開発環境構築手順
```bash
# Bunのインストール
curl -fsSL https://bun.sh/install | bash

# プロジェクトの初期化
bun init

# 依存パッケージのインストール
bun install
```

## 技術的制約

### 1. ファイル処理
- UTF-8エンコーディングのみサポート
- Markdownファイル(.md)のみ対応
- ファイルサイズの制限なし（メモリ効率化で対応）

### 2. URL処理
- http/https形式のURLのみサポート
- URLの妥当性チェック必須
- 不正なURLは警告を出力し処理継続

### 3. パフォーマンス要件
- 大規模ファイルでの実用的な処理時間
- メモリ使用量の最適化
- 非同期処理の活用

## 開発プラクティス

### 1. コーディング規約
- ESLintによる静的解析
- Prettierによるコード整形
- TypeScriptの厳格モード使用

### 2. ドキュメント
- JSDoc形式のコメント
- README.mdの維持
- 変更履歴の記録

### 3. バージョン管理
- Gitによるソース管理
- セマンティックバージョニング
- 変更履歴の管理

## テスト環境

### 1. ユニットテスト
- Bunのテストランナー使用
- モック/スタブの活用
- カバレッジレポート生成

### 2. 統合テスト
- テストファイルの用意
- エッジケースの網羅
- 実際のファイル操作を含むテスト

### 3. パフォーマンステスト
- 大規模ファイルでのベンチマーク
- メモリ使用量の測定
- 処理時間の計測

## ビルドとデプロイメント

### 1. ビルド設定
```json
{
  "scripts": {
    "build": [
      "bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 ./src/index.ts --outfile dist/cft-linux",
      "bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64-baseline ./src/index.ts --outfile dist/cft-linux-baseline",
      "bun build --compile --minify --sourcemap --bytecode --target=bun-darwin-x64 ./src/index.ts --outfile dist/cft-macos",
      "bun build --compile --minify --sourcemap --bytecode --target=bun-darwin-arm64 ./src/index.ts --outfile dist/cft-macos-arm64"
    ]
  }
}
```

### 2. 最適化オプション
- `--minify`: コードサイズの最適化
- `--sourcemap`: デバッグ情報の埋め込み
- `--bytecode`: 起動時間の改善
- `--compile`: シングルバイナリ生成

### 3. プラットフォームサポート
- Linux x64（モダンCPU向け）
- Linux x64（古いCPU向け）
- macOS x64
- macOS ARM64

### 4. 成果物管理
- distディレクトリでの管理
- .gitignoreでの除外設定
- GitHub Releasesでの配布

## 監視と分析

### 1. エラー監視
- エラーログの出力
- スタックトレースの提供
- 警告メッセージの管理

### 2. パフォーマンス監視
- 処理時間の計測
- メモリ使用量の追跡
- ボトルネックの特定

## セキュリティ考慮事項

### 1. ファイル操作
- パス検証
- 書き込み権限の確認
- ファイルシステムの安全な操作

### 2. URL処理
- URLの検証
- 安全なURL解析
- エスケープ処理

## メンテナンス計画

### 1. 依存関係
- 定期的な更新確認
- セキュリティパッチの適用
- 互換性の維持

### 2. バグ修正
- イシュートラッキング
- 修正の優先順位付け
- パッチリリースの管理

### 3. 機能拡張
- 後方互換性の維持
- 段階的な機能追加
- ドキュメントの更新

# アクティブコンテキスト: cft

## 現在の作業状況

### 進行中のタスク
1. **テスト拡充**
   - エッジケースのテスト追加
   - パフォーマンステストの実装
   - テストカバレッジの向上

### 最近の変更
- 改行を含むタイトルのサポート追加
  - 正規表現パターンの改善
  - タイトル内の改行をスペースに置換
  - テストケースの追加
- v0.2.0リリース
  - テキストフラグメントを含む脚注のサポート追加
  - 同一URLの脚注の重複排除機能の実装
  - GitHub Actionsテストワークフローの追加
  - カバレッジレポートの有効化
  - GitHub Actionsの権限設定の修正
- インストール機能の強化
  - install.shスクリプトの実装
  - curlを使用した簡単インストール
  - OSとアーキテクチャの自動検出
  - GitHub Releasesとの統合
- コアモジュールの実装完了
  - utils.ts: URL解析、ファイル操作ユーティリティ
  - parser.ts: Markdownパース、注釈検出
  - converter.ts: 変換ロジック
  - index.ts: CLIインターフェース
- テストの基本実装
  - ユニットテスト
  - 統合テスト
- 基本機能の動作確認
- クロスプラットフォームビルドの実装
  - Linux (x64, baseline)向けビルド
  - macOS (x64, arm64)向けビルド
  - 最適化オプションの設定
- GitHub Actionsワークフローの設定
  - 自動ビルドの構築
  - GitHub Releasesの設定
- v0.1.0のリリース完了

### 保留中の決定事項
1. **パフォーマンス最適化**
   - 大規模ファイルの処理効率
   - メモリ使用量の最適化
   - 処理速度の向上

2. **機能拡張**
   - 複数ファイルの一括処理
   - バックアップ機能
   - カスタマイズオプション

## 次のステップ

### 直近の優先タスク
1. **CI/CDの検証**
   - テストワークフローの動作確認
   - カバレッジレポートの確認
   - ビルドとテストの統合

2. **インストールスクリプトのテスト**
   - 各プラットフォームでの動作確認
   - エラーハンドリングの検証
   - インストール成功率の確認

2. **テスト強化**
   - エッジケースのテスト追加
   - パフォーマンステストの実装
   - テストカバレッジレポートの設定

2. **パフォーマンス最適化**
   - 大規模ファイルのベンチマーク
   - メモリ使用量の分析
   - 処理速度の改善

3. **機能拡張の準備**
   - 複数ファイル処理の設計
   - バックアップ機能の設計
   - 設定ファイルの形式検討

### 技術的な検討事項
1. **パフォーマンス**
   - ストリーム処理の導入検討
   - メモリ使用量の最適化手法
   - 非同期処理の活用

2. **拡張性**
   - プラグインシステムの設計
   - カスタマイズオプションの実装
   - 設定ファイルの導入

3. **品質管理**
   - テストカバレッジの目標設定
   - パフォーマンス基準の設定
   - 自動テストの拡充

## 現在の課題

### 技術的な課題
1. **パフォーマンス**
   - 大規模ファイルでのメモリ使用量
   - 処理速度の最適化
   - ストリーム処理の導入

2. **拡張性**
   - プラグインシステムの設計
   - カスタマイズ機能の実装
   - 設定管理の方法

### 未解決の問題
1. **機能面**
   - 複数ファイルの一括処理
   - バックアップ機能の実装
   - 設定ファイルの形式

2. **運用面**
   - バージョニングの方針
   - ドキュメント管理の方法
   - パフォーマンス基準の設定

## アクティブな決定事項

### 確定した設計判断
1. **アーキテクチャ**
   - モジュール分割（utils, parser, converter）
   - データフロー（入力→パース→変換→出力）
   - エラーハンドリング戦略

2. **技術スタック**
   - TypeScript + Bun
   - Bunのテストランナー
   - Biomeによるコード整形
   - Devboxによる開発環境標準化
   - GitHub Actionsによる自動化

### 検討中の設計判断
1. **拡張機能**
   - プラグインシステムの設計
   - カスタマイズオプション
   - 設定ファイルの形式

2. **品質管理**
   - テストカバレッジ目標
   - パフォーマンス基準
   - ドキュメント要件

## 次回のアップデート予定
- テストカバレッジの向上
- パフォーマンス最適化の実施
- 複数ファイル処理の設計開始

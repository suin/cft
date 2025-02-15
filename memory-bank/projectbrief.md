# プロジェクト概要: cft (Citation to FootnoTe)

## プロジェクトの目的と背景
ChatGPT Deep researchがMarkdownレポートを生成する際、出典をインライン形式 `([タイトル](URL))` で記述することが多く、これが文章の可読性を低下させる原因となっています。このツールは、そのようなDeep researchのレポートを、より読みやすい注釈形式に自動変換することを目的としています。

このプロジェクトは、Deep researchが生成するレポートの可読性を向上させ、より効果的な情報共有を実現することを目指します。

## 主要な要件

### 基本機能
- Markdownファイル(.md)の処理
- インライン出典 `([タイトル](URL))` を注釈形式 `[^domain-n]` に変換
- 注釈セクションの自動生成と管理
- UTF-8エンコーディングのファイルのみをサポート

### 入出力仕様
入力形式:
```markdown
本文中の出典 ([タイトル](https://example.com/page)) が続く
```

出力形式:
```markdown
本文中の出典 [^example.com-1] が続く

[^example.com-1]: [タイトル](https://example.com/page)
```

### コマンドライン
```bash
cft <file.md>
```

### 配布方法
1. **プリビルドバイナリ**
   - GitHub Releasesを通じた配布
   - プラットフォームごとの最適化バイナリ
     - Linux x64（モダンCPU向け）
     - Linux x64（古いCPU向け）
     - macOS x64
     - macOS ARM64

2. **インストール方法**
   - curlを使用した自動インストール（推奨）
     ```bash
     curl -fsSL https://raw.githubusercontent.com/suin/cft/main/install.sh | sh
     ```
   - GitHub Releasesからの手動インストール
     * バイナリのダウンロード
     * 実行権限の付与
     * PATHへの追加

3. **ソースからのビルド**
   - Devboxを使用した開発環境の構築
   - クロスプラットフォームビルドのサポート
   - 最適化オプションの提供

## 制約条件
- 大規模なMarkdownファイルでも実用的な処理時間で完了すること
- メモリ使用量を最適化すること
- 部分的な変換を防止すること
- エラー発生時は適切なメッセージを表示し処理を中断すること

## 成功基準
1. インライン出典を正確に注釈形式に変換できること
2. 既存の注釈との整合性を保持できること
3. ファイルの整合性を維持できること
4. エラー発生時に適切に処理を中断できること
5. 実用的なパフォーマンスを実現できること
6. 各プラットフォームで正常に動作すること

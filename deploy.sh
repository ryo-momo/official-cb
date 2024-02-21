#!/bin/bash
set -e

# TypeScriptのコンパイル
tsc

# 開発用の依存関係を削除
npm prune --omit=dev

# 既存のzipファイルを削除
rm -f project.zip

# 必要なファイルのみを含むzipファイルを作成
zip -r project.zip . -x "*.git*" -x "*devDependencies*" -x "tests/*" -x "unified_test.ts" -x "tempCodeRunnerFile.ts" -x "legacy_files/*" -x "mock_db/*" -x "src/*" -x "project.zip" -x "deploy.sh"

# AWS Lambda関数のコードを更新
aws lambda update-function-code --function-name official_cb_staging --zip-file fileb://project.zip

# 依存関係を再インストール
npm install

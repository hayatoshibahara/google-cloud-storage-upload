# Google cloud storage upload

生成AIワークショップ用の実装です。

Google Cloud storage にファイルをアップロードし、署名つきURLを発行します。

## Storage 無料枠

- us-east1, us-west-1, us-central1 region のみ

https://cloud.google.com/free/docs/free-cloud-features?hl=ja#storage

## 手順

1. Google Cloud でアカウントを作成しカードを登録
1. Google Cloud Storage で Bucket を作成 
1. Google Cloud で Service account を作成
1. サービスアカウントキーを作成しダウンロードし `key` ディレクトリに配置
1. キーをルートに配置し、`.env.example` を参考に`.env`を作成する
1. `npm run dev` でアプリケーションを実行

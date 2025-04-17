# インストール方法

# 1. fnmをインストール

Fast Node Manager(fnm)をインストールする手順を示す．

1. **ダウンロード**

[こちらのリンク](https://github.com/Schniz/fnm/releases)からfnmの`fnm-windows.zip
`をインストールする．

2. **展開してインストーラを起動**

ダウンロードしたzipファイルを展開して`fnm.exe`を実行する．

3. **インストール確認**

コマンドプロンプトを開いてインストール確認を行う．

```shell
$ fnm -V 

~~ 以下のように出力されたら成功 ~~
fnm 1.38.1
```

## 2. nodeをインストール

1. **公式サイトからインストール**
[公式サイト](https://nodejs.org/ja/download)のスクリプトをそのまま実行するとインストールできる．

```shell
$ winget install Schniz.fnm
$ fnm install 22
```

2. **環境変数の設定**

環境変数が自動で設定されないことがある．fnmはデフォルト設定では`C:\Users\{ユーザ名}\AppData\Local\fnm_multishells`にバージョンごとに`node`と`npm`をインストールする．使用するバージョンの実行ファイルがあるフォルダのパスを設定する．

**Tips**
windowsでは`環境変数の設定`から環境変数を設定することができる．

3. **インストール確認**

```shell
$ node -v
$ npm -v 

~~~ 以下のように出力されたら成功 ~~~
v22.14.0
10.9.2
```
# IMUはHTTPSアクセスでないと使えない

IMUセンサデータはdeviceMotionEvent APIを使用して取得している．このAPIはHTTPSアクセスでないと起動しない．

HTTPアクセスすると`deviceMotionEvent is not defined`というエラーが出力されてしまう．

具体的な対処方法としては，

```shell
$ npm start <- これだとhttpアクセスしかできない

$ https=true npm start <- これでhttpsアクセスできる
```

その後，`https://192.168.203.10:3000`など起動しているローカルサーバに3000番ポートでアクセスすることでIMUセンサデータを取得するこができる．
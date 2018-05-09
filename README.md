# NEM fest wallet

> This is a NEM wallet for NEM CREATORS FESTIVAL.

## Description
This is a NEM wallet for NEM CREATORS FESTIVAL.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## Test case
###### 正常系
- [x] ウォレット作成 - 「ウォレットを作成する」押下で作成画面へ遷移
- [x] パスワード入力 - （ウォレット作成前）パスワードと確認用パスワードを入力後、「完了」押下でウォレットが作成されること
- [x] パスワード入力 - （ウォレット作成後）パスワード入力でダッシュボード遷移
- [x] ダッシュボード - ウォレットリセット押下でパスワード入力画面へ遷移すること。
- [x] ダッシュボード - ウォレットリセットのパスワード入力後ダイアログが表示されること。「リセットする」でウォレットが削除されること。
- [x] ダッシュボード - 右上のモザイクボタン押下で保有モザイクを一覧表示
- [x] ダッシュボード - 右上の更新ボタン押下でNEMとモザイクを更新
- [x] ダッシュボード - 「秘密鍵を表示する」押下後パスワード画面表示
- [x] ダッシュボード - 「秘密鍵を表示する」押下後パスワード入力後、秘密鍵を表示
- [x] 受け取る画面 - アカウント情報が表示
- [x] 受け取る画面 - 送金先アドレスのコピーできること
- [x] 受け取る画面 - QRコード表示、他端末から読み取れること
- [x] QRコードから送る - カメラ起動
- [x] QRコードから送る - NEMのQRコード(type:1, type:2)が読み取れる
- [x] 履歴を見る - トランザクション履歴がなければ表示されない
- [x] 履歴を見る - トランザクション履歴がある場合、承認・未承認の履歴が一覧表示
- [x] 履歴を見る - トランザクション履歴がある場合、一覧押下後詳細画面へ遷移
- [x] 履歴を見る - 右上の更新ボタン押下でトランザクション履歴が更新
- [x] 送金する - 「XEMを送る」押下でXEM送金画面へ遷移
- [x] 送金する - 「モザイクを送る」押下でモザイク送金画面へ遷移
- [x] 送金する - 「すべて出金する」押下でNEMとモザイクの送金画面へ遷移
- [x] NEMを送金する - 送信先アドレス、数量、メッセージ入力後、下部の数量、手数料、合計、残高が正常に表示されていること
- [x] NEMを送金する - 送信先アドレスと数量入力後、「送金する！」押下で確認ダイアログが表示されること
- [x] NEMを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージなし
- [x] NEMを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージ有り
- [x] NEMを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること 送金アドレス − 付き
- [x] NEMを送金する - 確認ダイアログで「いいえ」押下後、送金されないこと
- [x] モザイクを送金する - 送信先アドレス、数量、メッセージ入力後、下部の数量、手数料、合計、残高が正常に表示されていること
- [x] モザイクを送金する - 送信先アドレスと数量入力後、「送金する！」押下で確認ダイアログが表示されること
- [x] モザイクを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージなし
- [x] モザイクを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージ有り
- [x] モザイクを送金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること 送金アドレス − 付き
- [x] モザイクを送金する - 確認ダイアログで「いいえ」押下後、送金されないこと
- [x] すべて出金する - 送信先アドレス、数量、メッセージ入力後、下部の数量、手数料、合計、残高が正常に表示されていること
- [x] すべて出金する - 送信先アドレスと数量入力後、「送金する！」押下でXEMの数量と手数料が再計算された数字が表示されていること
- [x] すべて出金する - 送信先アドレスと数量入力後、「送金する！」押下で確認ダイアログが表示されること
- [x] すべて出金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージなし
- [x] すべて出金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること メッセージ有り
- [x] すべて出金する - 確認ダイアログで「送金する」押下後、送信先アドレスへ正常に送金できること 送金アドレス − 付き
- [x] すべて出金する - 確認ダイアログで「いいえ」押下後、送金されないこと
- [x] 送金後 - 「トランザクション承認中...」のToastが表示されること、「履歴を見る」画面で未承認欄が表示されていること
- [x] 送金後 - 「トランザクションが承認されました」のToastが表示された後、アカウントの金額と履歴情報が更新されていること ※更新タイミングによっては反映されない場合がある（制限事項）、その際は手動で更新する

###### 異常系
- [x] パスワード入力 - （ウォレット作成前）パスワードと確認用パスワードで誤ったパスワードを入力後、「完了」押下でウォレットが作成されないこと
- [x] パスワード入力 - （ウォレット作成後）誤ったパスワード入力でダッシュボードへ遷移できないこと
- [ ] NEMを送金する - 残高以上の数量を入力後、「送金する！」押下で「残高が足りません」のToastが表示されること
- [ ] NEMを送金する - 誤った送金先アドレスを入力後、「送金する！」押下でエラーダイアログが表示されること
- [ ] NEMを送金する - 数量に数字以外の文字入力後、「送金する！」押下でエラーダイアログが表示されること
- [ ] NEMを送金する - XXX
- [ ] NEMを送金する - XXX

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

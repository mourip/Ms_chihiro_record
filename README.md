# Ms_chihiro_record
## はじめに
ちひろさんの記録簿はモバマスのプレイ時に自動でアイテム（スタドリ、エナドリなど）の個数やモバコインの残高を自動で記録します。

## 記録できるもの
- スタドリ、エナドリ、マイスタ、マイエナ、各種ハーフドリンク
- イベントの順位とポイントの推移
- 課金残高

## 前提条件
chromeでUA偽装してモバマスをプレイしていることを前提としています
よくわからない人はググってください。

また、chromeの拡張機能として「HTML5 FileSystem Explorer」を導入していることを前提とします。「HTML5 FileSystem Explorer」を使って記録したデータをchrome上で閲覧するために必要です
以下のURLから導入してください
<https://chrome.google.com/webstore/detail/html5-filesystem-explorer/nhnjmpbdkieehidddbaeajffijockaea>

## 導入方法
URLを開いて「chromeに導入」をクリックしてください。自動で導入されます
<https://chrome.google.com/webstore/detail/%E3%81%A1%E3%81%B2%E3%82%8D%E3%81%95%E3%82%93%E3%81%AE%E8%A8%98%E9%8C%B2%E7%B0%BF/hoolpddpkohkgkgnncmlecaaigjblogp>
## 使用方法
アイテム欄のページを閲覧した時点で自動で記録を行います。この時前回記録時と比較して変化がない場合は記録されません。
## 記録の確認
記録の閲覧方法はchromeのURL欄の左側にあるアイコンの中から「HTML5 FileSystem Explorer」をクリックしてください。そして、「Persistance」をクリックすると、各種テキストファイルが出てきます。
詳しくは下記gifを参照してください。

アイテムの確認について

![アイテムの確認](https://github.com/mourip/Ms_chihiro_record/blob/images/item.gif)

課金の確認について

![課金額の確認](https://github.com/mourip/Ms_chihiro_record/blob/images/kakin.gif)


## 暫定的な機能
### 過剰なスタ走りの防止
拡張機能導入時に通知の許可が求められます。この許可はOKにしてください。  
OKにすると、「APやBPが最大の状態」かつ、「ライブが発生している」状態で通知が出るようになります。  
また、その時に警告音もなるようになります。人がいるときに恥ずかしい思いをしないように注意してください  

## 注意事項
この拡張機能は当然非公式で作られています。そのため、注意してほしい点がいくつかあります。

1. 自己責任で用いること。この拡張機能を用いて起きた不利益について開発者側は責任を持ちません。

2. 公式や運営に問い合わせることはやめてください。

3. ソースコードを見て自分で更に使いやすくしてもらって構いません。その時は連絡してくれるとうれしいです。

## バグ報告について
<nanaya.mouri@gmail.com>におねがいします。

##Licence
MIT

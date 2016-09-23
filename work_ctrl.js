/*
The MIT License (MIT)
Copyright (c) 2016 mourip
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*お仕事ページに飛んだ時の処理を定義するためのjsファイル*/


/*
ちひーるの記録のやり方
①お仕事ページに飛ぶ。そのタイミングで前段階のBPをロードする。
これと今のBPが変化がないかを確かめる
②変化があるとその時点での変化量を取得する
時間　変化量
③この時点では時間だけを見る。
④合計で１０分を経過していた場合は本来記録するべきところに記録をする
*/

/*
CP #top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)
BP #bp_mic
*/


/*
お仕事画面で記録したいこと
ちひーるの回数
30分後のごとの回数
1日ごとの回数
累計回数
*/

// ロワに関する関数
function royale_log(){
    /*
    今のBPと最大のBPを得る
    */
    console.log("ロワの仕事やで");
    //bpの表示がなかったら以降の処理を打ち切る
    if(document.querySelector("#bp_mic")==null){
        console.log("bpを示すセレクタ-が無いです");
        return ;
    }
    var now_bp=document.querySelector("#bp_mic").innerText.split(" ")[2];
    var max_bp=document.querySelector("#bp_mic").innerText.split(" ")[4];

    /*BPが等しいならなら通知+警告音の再生を行う*/
    if(now_bp==max_bp){
        var n = new Notification("BP回復してますよ\nライブしてくださいね！");

        // sine
        var oscillator = audioCtx.createOscillator();
        oscillator.connect( audioCtx.destination );
        oscillator.type = 'sine';
        oscillator.frequency.value = 3000;

        var soundLength = 0.5;
        oscillator.start();
        oscillator.stop( audioCtx.currentTime + soundLength );
        setTimeout(n.close.bind(n), 3000);
    }

}


// ディレクトリを作成する関数
function directory_root(){
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("temp", {
                    create: true
                },
                function(dirEntry) {
                    var text = "ディレクトリパス：" + dirEntry.fullPath;
                    // console.log(text);
                    //text += "ディレクトリ名："+dirEntry.name+"<br>";
                    //document.getElementById("result").innerHTML = text;
                },
                function(err) { // 失敗時のコールバック関数
                    console.log(err);
                });
        });
    });
}

//イベントの種類を判定する関数
function event_checker(){
    if (document.querySelector("#event_challenge") != null )
        challenge_log();
    else if (document.querySelector("#event_pmf") != null)
        fes_log();
    else if(document.querySelector("#event_royale")!=null)
        royale_log();
}

//通知の許可を得るための関数
function notifications_permission(){
    // Notification対応しているかどうか
    if (window.Notification) {
        // Permissionの確認
        // 許可が取れていない場合はNotificationの許可を取る
        console.log("通知できまっせ");
        if (Notification.permission === 'denied'|| Notification.permission === 'default'){
            Notification.requestPermission(function(result) {
                if (result === 'denied') {
                    alert('リクエスト結果：通知許可されませんでした');
                } else if (result === 'default') {

                    alert('リクエスト結果：通知可能か不明です');

                } else if (result === 'granted') {

                    alert('リクエスト結果：通知許可されました！！');
                    var n = new Notification("Hello World");
                }
            });
        }

    } else {
        alert('Notificationは無効です');
    }
}



notifications_permission();
directory_root();
event_checker();

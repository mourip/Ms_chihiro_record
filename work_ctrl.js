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

/*
chrome.storageの変数郡
last_p:最終段階でのポイント
start_30m_time:記録開始時刻
last_30m_time:最後の記録の時刻
sum_30m_p:その段階でのちひーるの回数（生で増えた分は検知できない）



*/


/*
ファイルの保存形式
    30分版
    DD/HH/MM~DD/MM, m,count
 */



//日付を/区切りで得るための関数
/*この関数郡は一旦封印
function get_date(){
    //現在時刻をmomentオブジェクトとして取得
    var now=moment();
    // フォーマットに沿って時刻を出力
    var dates=now.format('YYYY/MM/DD/HH/mm/ss');
    return dates;
}

function chi_heal_checker(now_p){
    //過去のポイントを確認する
    // console.log(now_p);

    chrome.storage.local.get("last_p", function (value) {
        // 過去のデータが存在しない場合は登録する
        if(value.last_p=="undefined"){
            console.log("初回みたいですね！")
            console.log(value.last_p);
        }
        //過去のポイントが増えている場合は以下の処理を行う
        if(value.last_p<now_p){
            //一旦更新する
            console.log("増えてるみたいですね！");
            chi_heal_2m(Number(now_p)-Number(value.last_p));
            // chi_heal_30m(now_p-value.last_p);
        }
        // 過去のポイントが減っている時は以下の処理を行う
        else if(value.last_p>now_p){
            // 一旦更新するだけになる
            console.log("減っているみたいですね！");
            chi_heal_2m(0);
        }
        else if(value.last_p==now_p){
            console.log("変化ないですね");
            chi_heal_2m(0);
        }

    });
    chrome.storage.local.set({'last_p': now_p}, function () {console.log('stored');});

}

// 2分のチヒールを記録する処理
function chi_heal_2m(plus_p){
    // ストレージの種類
    // 時刻　前のp　累計p

    // スタート時刻の取得　2分経っているか確認　経っていたら回数を通知して削除
    // スタート時刻の取得　2分経っていなかった場合　回数を増やすか確認して増えていたら増加する
    // そもそもkeyが存在していない場合は全部登録する

    var now_time=get_date();
    //必要なキーを全部獲得しておく
    chrome.storage.local.get(['start_2m_time','last_2m_time','sum_2m_p'], function (value) {
        //存在しない場合は開始時刻と最初の回数（1回）
        if(value.start_2m_time=="undefined"){
            console.log("2分コース初回ですね！");
            // 現在時刻と最終時刻の登録
            chrome.storage.local.set({'start_2m_time':now_time},function(){});
            chrome.storage.local.set({'last_2m_time':now_time},function(){});
            // ここにいる時点で回復していることは明らかなので増えた文の値を足す
            console.log(plus_p)
            chrome.storage.local.set({'sum_2m_p':Number(plus_p)},function () {});
        }
        // 時刻が一緒になることはありえないので一旦elseで分岐
        else {
            console.log("2分コースですね！")
            //最初の時刻のmomentオブジェクトを得る
            var start_2m_time_moment=moment(value.start_2m_time,"YYYY/MM/DD/HH/mm/ss");
            // 今の時刻のmomentオブジェクトを得る
            var now_time_moment=moment(now_time,"YYYY/MM/DD/HH/mm/ss");
            // 時刻の差分をとる
            var diff_time=now_time_moment.diff(start_2m_time_moment,"m");
            console.log("差："+diff_time);
            console.log("開始時刻："+start_2m_time_moment.format("DD/HH/mm"));
            console.log("今の時刻"+now_time_moment.format("DD/HH/mm"));
            // 差分の時間が2分以上の時は結果をファイルに保存＋通知を出す
            if(Number(diff_time)>=2){
                console.log("2分経っていますね！");
                // 開始時刻のduring形式の文字列を得る
                var startDDHHmm=start_2m_time_moment.format('DD/HH/mm');
                // 最終時刻のモーメントを獲得する
                var last_2m_time_moment=moment(value.last_2m_time,"YYYY/MM/DD/HH/mm/ss");
                // 最終時刻のduring形式の文字列を得る
                var lastDDHHmm=last_2m_time_moment.format('DD/HH/mm');
                // during形式の文字列を獲得
                var during=startDDHHmm+"~"+lastDDHHmm;

                // lasttimeとstarttimeの時間の差分を得る
                var last_start_diff=last_2m_time_moment.diff(start_2m_time_moment,"m");

                console.log("経過時間："+String(last_start_diff));

                // ファイルの保存
                save_txt("chi_heal_2m.txt","minutes",during,last_start_diff,value.sum_2m_p,Number(count)/Number(last_start_diff));
                // 通知の出力
                // 出力するtxtはこちらで用意する
                var count=value.sum_2m_p;
                console.log("************************************************");
                console.log(Number(count)/Number(last_start_diff));
                console.log(Number(count));
                console.log(Number(last_start_diff));
                console.log("************************************************");
                var notification_txt=during+"\n"+String(last_start_diff)+"分:"+String(count)+"回,"+(Number(count)/Number(last_start_diff));
                notifications_chi_heal(notification_txt,diff_time,count,true)
                // 新しく登録し直す
                // 現在時刻と最終時刻の登録
                chrome.storage.local.set({'start_2m_time':now_time},function(){});
                chrome.storage.local.set({'last_2m_time':now_time},function(){});
                // 回復量を初期値とする
                chrome.storage.local.set({'sum_2m_p':Number(plus_p)},function () {});
            }

            //差分の時間が2分以下の時は最終時刻の更新を行う
            else{
                console.log("まだ２分経っていないみたいですね！")

                // 最終時刻の更新
                chrome.storage.local.set({'last_2m_time':now_time},function(){});
                // 回復量の記録
                chrome.storage.local.set({'sum_2m_p':Number(value.sum_2m_p)+Number(plus_p)},function () {});
                console.log("今のポイント："+value.sum_2m_p);

            }
        }
    });


}

// 30分のチヒールを記録する処理
function chi_heal_30m(plus_p){
    // ストレージの種類
    // 時刻　前のp　累計p

    // スタート時刻の取得　30分経っているか確認　経っていたら回数を通知して削除
    // スタート時刻の取得　30分経っていなかった場合　回数を増やすか確認して増えていたら増加する
    // そもそもkeyが存在していない場合は全部登録する

    var now_time=get_date();
    //必要なキーを全部獲得しておく
    chrome.storage.local.get(['start_30m_time','last_30m_time','sum_30m_p'], function (value) {
        //存在しない場合は開始時刻と最初の回数（1回）
        if(value.start_30m_time=="undefined"){
            console.log("30分コース初回ですね！");
            // 現在時刻と最終時刻の登録
            chrome.storage.local.set({'start_30m_time':now_time},function(){});
            chrome.storage.local.set({'last_30m_time':now_time},function(){});
            // ここにいる時点で回復していることは明らかなので増えた文の値を足す
            chrome.storage.local.set({'sum_30m_p':Number(plus_p)},function () {});
        }
        // 時刻が一緒になることはありえないので一旦elseで分岐
        else {
            console.log("30分コースですね！")
            //最初の時刻のmomentオブジェクトを得る
            var start_30m_time_moment=moment(value.start_30m_time,"YYYY/MM/DD/HH/mm/ss");
            // 今の時刻のmomentオブジェクトを得る
            var now_time_moment=moment(now_time,"YYYY/MM/DD/HH/mm/ss");
            // 時刻の差分をとる
            var diff_time=now_time_moment.diff(start_30m_time_moment,"m");

            console.log("差："+diff_time);
            console.log("開始時刻："+start_30m_time_moment.format("DD/HH/mm"));
            console.log("今の時刻"+now_time_moment.format("DD/HH/mm"));
            // 差分の時間が30分以上の時は結果をファイルに保存＋通知を出す
            if(Number(diff_time)>=29){
                console.log("30分経っていますね！");
                // 開始時刻のduring形式の文字列を得る
                var startDDHHmm=start_30m_time_moment.format('DD/HH/mm');
                // 最終時刻のモーメントを獲得する
                var last_30m_time_moment=moment(value.last_30m_time,"YYYY/MM/DD/HH/mm/ss");
                // 最終時刻のduring形式の文字列を得る
                var lastDDHHmm=last_30m_time_moment.format('DD/HH/mm');
                // during形式の文字列を獲得
                var during=startDDHHmm+"~"+lastDDHHmm;

                // lasttimeとstarttimeの時間の差分を得る
                var last_start_diff=last_30m_time_moment.diff(start_30m_time_moment,"m");

                // ファイルの保存
                save_txt("chi_heal_30m.txt","minutes",during,last_start_diff,value.sum_30m_p,Number(count)/(Number(diff_time)));
                // 通知の出力
                // 出力するtxtはこちらで用意する
                // var count=value.sum_2m_p;
                var notification_txt=during+"\n"+String(diff_time)+"分:"+String(count)+"回　,効率:"+(Number(count)/(Number(diff_time)));
                notifications_chi_heal(during,diff_time,count,true)
                // 新しく登録し直す
                // 現在時刻と最終時刻の登録
                chrome.storage.local.set({'start_30m_time':now_time},function(){});
                chrome.storage.local.set({'last_30m_time':now_time},function(){});
                // 回復量を初期値とする
                chrome.storage.local.set({'sum_30m_p':Number(plus_p)},function () {});
            }

            //差分の時間が30分以下の時は最終時刻の更新を行う
            else{
                // 最終時刻の更新
                chrome.storage.local.set({'last_30m_time':now_time},function(){});
                // 回復量の記録
                chrome.storage.local.set({'sum_30m_p':Number(value.sum_30m_p)+Number(plus_p)},function () {});
                console.log("今のポイント："+value.sum_2m_p);

            }
        }
    });


}

function save_txt(filename,unit,during,diff_time,count,efficiency){
    console.log(efficiency);

    // console.log(dates);
    // 書き込むデータをUTF８形式にする
    var utf8during = unescape(encodeURIComponent(during));
    var utf8diff_time = unescape(encodeURIComponent(diff_time));
    var utf8count=unescape(encodeURIComponent(count));
    var utf8unit=unescape(encodeURIComponent(unit));
    var utf8effi=unescape(encodeURIComponent(efficiency));

    var txt_name ="etc/" +filename;
        // PRESISTENTで勝手に削除されないようにする
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024*5, function(fileSystem) {
        //ファイルを取得する（なければ作成)
        fileSystem.root.getFile(txt_name, {
            'create': true
        }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                //  ファイルの書き込み位置は、一番最後とする
                fileWriter.seek(fileWriter.length);
                //  出力行
                var lines = '';
                //  0バイトファイルの場合、ヘッダ行を作成する
                if (fileWriter.length == 0) {
                    var headers = new Array("during",utf8unit,"count","efficiency");
                    lines = headers.join(",") + "\n";

                }

                //  データ行の作成
                var details = new Array(utf8during, utf8diff_time, utf8count,utf8effi);
                lines += details.join(",") + "\n";
                var blob = new Blob([lines], {
                    type: 'text/plain'
                });
                //データの書き込み
                fileWriter.write(blob);

                //ファイルの更新の通知
                fileWriter.onwriteend = function(e) {
                    console.log(txt_name + 'Write completed.');
                };
                // エラー通知
                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

            });
        });
    });

}


function notifications_chi_heal(txt,flag){
    var n = new Notification(txt);
    var audioCtx = new AudioContext;
    //2分の通知はtrueなのでこっち
    if(flag){
        var oscillator = audioCtx.createOscillator();
        oscillator.connect( audioCtx.destination );
        oscillator.type = 'square';
        oscillator.frequency.value = 1000;

        var soundLength = 0.1;
        oscillator.start();
        oscillator.stop( audioCtx.currentTime + soundLength );

        //通知は3000ミリ秒表示する
        setTimeout(n.close.bind(n), 5000);
    }
    //一日の通知はこっち
    else{
        var oscillator = audioCtx.createOscillator();
        oscillator.connect( audioCtx.destination );
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 1000;

        var soundLength = 0.1;
        oscillator.start();
        oscillator.stop( audioCtx.currentTime + soundLength );

        //通知は3000ミリ秒表示する
        setTimeout(n.close.bind(n), 5000);
    }


}
*/




//alart音+全快のお知らせ
function work_alert(){

    /*
    var oscillator = audioCtx.createOscillator();
    oscillator.connect( audioCtx.destination );
    oscillator.type = 'square';
    oscillator.frequency.value = 1000;

    var soundLength = 0.1;
    oscillator.start();
    oscillator.stop( audioCtx.currentTime + soundLength );
    */
    var n = new Notification("全回復してますよ\nライブしてくださいね！");
    var soundSrc = "a.mp3";
    if (soundSrc){
        console.log("aaaa");
      var playsrc = null;
      playsrc = chrome.extension.getURL( ("./sound/"+soundSrc) );	//任意の場所というかpath的な
      var audio = new Audio("");
      audio.src = playsrc;	//URL
      audio.volume = (30 / 100);	//30%のぼりゅーむ？]
      audio.play();
    }

    //通知は3000ミリ秒表示する
    setTimeout(n.close.bind(n), 3000);
}

// ドリフに関する関数
function dream_log(){
    /*
    今のAPと最大のAPを得る
    */
    //bpの表示がなかったら以降の処理を打ち切る
    console.log("ドリフですよー");
    if(document.querySelector("#bpImg")==null){
         console.log("apを示すセレクタ-が無いです");
         return ;
    }

    var now_bp=document.querySelector("#bpImg").innerText.split(" ")[2];
    var max_bp=document.querySelector("#bpImg").innerText.split(" ")[4];

    /*BPが等しい+ロワライブの判定あるなら通知+警告音の再生を行う*/
    if(now_bp==max_bp && document.querySelector("#top > div.m-Btm10 > a > div > span")!=null){
        // console.log("aaa");
        work_alert();
        // document.querySelector("#top > section:nth-child(10) > div:nth-child(5) > a > div > span").click();
    }

    // ここからちひーるの記録にうつる
    // 数字以外がはいらないように安全弁をつける
    console.log(now_bp);
    if(Number(now_bp) ){
        // chi_heal_checker(now_bp);
    }
    //０はNaNらしいですよー
    else if(now_bp=="0"){
        // chi_heal_checker(0);
    }
    // NaNならやらない
    else
        console.log("NaNですよー");
    return;

}


// TBSに関する関数
function TBS_log(){
    /*
    今のTPと最大のTPを得る
    #top > section:nth-child(9) > div.t-Cnt.m-Top5 > div
    */
    //TPの表示がなかったら以降の処理を打ち切る
    console.log("TBSですよー");
    if(document.querySelector("#top > section:nth-child(9) > div.t-Cnt.m-Top5 > div")==null){
         console.log("TPを示すセレクタ-が無いです");
         return ;
    }

    var now_TP=document.querySelector("#top > section:nth-child(9) > div.t-Cnt.m-Top5 > div").innerText.split(" ")[0].split("：")[1];
    var max_TP=document.querySelector("#top > section:nth-child(9) > div.t-Cnt.m-Top5 > div").innerText.split(" ")[2];

    console.log(now_TP);
    console.log(max_TP);
    /*BPが等しい+ロワライブの判定あるなら通知+警告音の再生を行う*/
    if(now_TP==max_TP){
        // console.log("aaa");
        work_alert();
        // document.querySelector("#top > section:nth-child(10) > div:nth-child(5) > a > div > span").click();
    }


    return;

}



// チャレに関する関数
function challenge_log(){
    /*
    今のAPと最大のAPを得る
    */
    //bpの表示がなかったら以降の処理を打ち切る
    console.log("チャレですよー");

    // ｃｐのセレクタ－は２種類
    // #top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)
    // #top > section:nth-child(8) > div:nth-child(3)
    // #top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)
    // #top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)
    var now_bp="";
    var max_bp="";

    // セレクタ－が２種類以上あるためこれで対処
    if(document.querySelector("#top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)")!=null){
        var cptext0=document.querySelector("#top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)").innerText.split('/')[0]
        var cptext1=document.querySelector("#top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)").innerText.split('/')[1]

        now_bp=cptext0.split(" ")[1]
        max_bp=cptext1.split(" ")[0]
    }

    else if(document.querySelector("#top > section:nth-child(8) > div:nth-child(3)")!=null){
        var cptext0=document.querySelector("#top > section:nth-child(8) > div:nth-child(3)").innerText.split('/')[0]
        var cptext1=document.querySelector("#top > section:nth-child(8) > div:nth-child(3)").innerText.split('/')[1]

        now_bp=cptext0.split(" ")[1]
        max_bp=cptext1.split(" ")[0]
    }
    // #top > section:nth-child(8) > div.m-Btm10 > div:nth-child(2)
    // 無課金タイマーなしのとき
    else if(document.querySelector("#top > section:nth-child(7) > div.m-Btm10 > div:nth-child(2)")!=null){
      var cptext0=document.querySelector("#top > section:nth-child(7) > div.m-Btm10 > div:nth-child(2)").innerText.split('/')[0]
      var cptext1=document.querySelector("#top > section:nth-child(7) > div.m-Btm10 > div:nth-child(2)").innerText.split('/')[1]
      now_bp=cptext0.split(" ")[1]
      max_bp=cptext1.split(" ")[0]
    }
    else {
        console.log("srekuta-")
        return
    }

    /*BPが等しい+ロワライブの判定あるなら通知+警告音の再生を行う*/
    if(now_bp==max_bp){
        // console.log("aaa");
        work_alert();
        // document.querySelector("#top > section:nth-child(10) > div:nth-child(5) > a > div > span").click();
    }

}

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

    /*
    記録取るべきこと
    30分間の規制回数
    1日の規制回数
    永続の規制回数

    各記録するを行う上に必要な変数
    スタートの時刻＋回数
    */

    /*BPが等しい+ロワライブの判定あるなら通知+警告音の再生を行う*/
    if(now_bp==max_bp && document.querySelector("#top > section:nth-child(8) > div.t-Cnt.m-Btm5 > a > div > span")!=null){

        work_alert();
        // document.querySelector("#top > section:nth-child(8) > div.t-Cnt.m-Btm5 > a > div > span").click();
    }



    return;
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
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("etc", {
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
    if (document.querySelector("#event_challenge") != null)
        challenge_log();
    else if (document.querySelector("#event_pmf")  != null)
        fes_log();
    else if(document.querySelector("#event_royale")!= null)
        royale_log();
    else if(document.querySelector("#event_dream") != null)
        dream_log();
    else if(document.querySelector("#event_teamtalk") != null)
        TBS_log();
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


//色々モーメントに対して試した関数（やりたいことは全部できることを確認済み）
function moment_test(){
    var now=moment()

    var test_timea="2016/10/4/16/50/23"
    var test=moment(test_timea,"YYYY/MM/DD/HH/mm/ss");
    var now_time=now.format('YYYY/MM/DD/HH/mm/ss');
    var test_time=test.format('YYYY/MM/DD/HH/mm/ss');
    // console.log("今:"+now_time);
    // console.log("例:"+test_time);
    var diffs=test.diff(now,"m");
    var test_time2=test.format('DD/HH/mm');
    // console.log(test_time2);
    // console.log("差："+diffs);

}

moment_test();

notifications_permission();
directory_root();
event_checker();

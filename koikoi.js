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

// こいこいのメダルの変動を確かめるためのjsファイル

/*
1こいこいのページかどうかを確かめる
2フォルダを作成する（既存関数の流用で大丈夫
3データを取得する（ここだけすこし特殊）
4データを書き込む（既存関数の流用で大丈夫）
 */

 function get_dates(){
     //現在時刻をmomentオブジェクトとして取得
     var now=moment();
     // フォーマットに沿って時刻を出力
     var dates=now.format('YYYY/MM/DD/HH/mm/ss');
     return dates;
 }


 // ポイントを記録するための関数
 function pt_write(filename,pt,pt_dif){

     // 現在の日付の取得

     var dates = get_dates();
     // console.log(dates);
     var utf8pt = unescape(encodeURIComponent(pt));
     var utf8pt_dif = unescape(encodeURIComponent(pt_dif));

     webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

         fileSystem.root.getFile(filename, {'create': true},function(fileEntry) {
             fileEntry.createWriter(function(fileWriter) {

                 //  ファイルの書き込み位置は、一番最後とする
                 fileWriter.seek(fileWriter.length);
                 //  出力行
                 var lines = '';
                 //  0バイトファイルの場合、ヘッダ行を作成する
                 if (fileWriter.length == 0) {
                     var headers = new Array("time", "coin", "coin_diff");
                     lines = "koikoi" + "\n" + headers.join(",") + "\n";

                 }

                 //  データ行の作成

                 var details = new Array(dates, utf8pt, utf8pt_dif);
                 lines += details.join(",") + "\n";
                 var blob = new Blob([lines], {
                     type: 'text/plain'
                 });
                 fileWriter.write(blob);
                 fileWriter.onwriteend = function(e) {
                     console.log('Write completed.');
                 };

                 fileWriter.onerror = function(e) {
                     console.log('Write failed: ' + e.toString());
                 };

             });
         });
     });
 }


// こいこいのメダルの記述を管理するための関数
function pt_checker(filename,now_pt)
{
    console.log(filename+"確認");
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes)
    {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs)
        {
            // ファイル取得
            fs.root.getFile(filename,
            {
                create: true
            }, function(fileEntry)
            {
                  fileEntry.file(function(file)
                  {
                      var reader = new FileReader();
                      reader.onloadend = function(e)
                      {
                          data = e.target.result;
                          // console.log(data);
                          if (!data)
                          {
                              console.log(filename+":白紙なので、作成します");
                              pt_write(filename,now_pt,0);

                          } else if (data)
                          {
                              // データのすべてを得る

                              var array_temp = data.split("\n");

                              //最後の行をみて書くかどうかを判断する
                              //最後のポイントを取得する
                              var last_pt = array_temp[array_temp.length - 2].split(",")[1];
                              if (String(last_pt) != String(now_pt))
                              {
                                  console.log(filename+":更新します");
                                  pt_write(filename,now_pt, Number(now_pt) - Number(last_pt));
                              } else
                              {
                                  console.log(filename+":更新しない");
                              }
                          }
                      };
                      reader.readAsText(file);
                  });
            });
        });
    });
}

// こいこいのチェックを行うための関数
function koikoi_checker(){
  strs=document.querySelectorAll("#top > section:nth-child(6) > div > div.displayBox > div > div>div")
  // メダルの枚数を管理するための変数
  var medal_num=0;
  for(var i=0;i<strs.length;i++){
    // こいこいのメダルはちょっと特殊でこうする必要がある\

    var now_digit=strs[i].className.split("_")[1];
    if(now_digit=="comma"){
      continue;
    }
    else{
      medal_num=medal_num*10+Number(now_digit);
    }
  }
  // 記録することができたのでファイルの記述へ移る
  pt_checker("etc/koikoi.txt",medal_num);
}


 //ディレクトリを作成するための関数
 function directry_root() {
     // 通常アイテムを管理するitemフォルダを作成するための処理
     navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
         window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
             fs.root.getDirectory("etc", {
                     create: true
                 },
                 function(dirEntry) {
                     // var text = "ディレクトリパス：" + dirEntry.fullPath;
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

// こいこいのページのみで動作する
if(document.querySelector("#top > section:nth-child(6) > div > div.displayBox > div > div")!=null){
    directry_root();
    koikoi_checker();
}
else{
    console.log("こいこいじゃないで");
}

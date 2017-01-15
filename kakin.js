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


function get_dates(){
    //現在時刻をmomentオブジェクトとして取得
    var now=moment();
    // フォーマットに沿って時刻を出力
    var dates=now.format('YYYY/MM/DD/HH/mm/ss');
    return dates;
}


function moba_write(num,dif)
{

  var dates=get_dates();
  // console.log(dates);
  var utf8num = unescape(encodeURIComponent(num));
  var utf8dif = unescape(encodeURIComponent(dif));

  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("moba_coin.txt", {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){

        //  ファイルの書き込み位置は、一番最後とする
        fileWriter.seek(fileWriter.length);
        //  出力行
        var lines = '';


        //  0バイトファイルの場合、ヘッダ行を作成する
        if (fileWriter.length == 0)
        {
          var headers = new Array("time","coin","difference");
          lines = headers.join(",") + "\n";

        }

        //  データ行の作成

       var details = new Array(dates,utf8num,utf8dif);
       lines += details.join(",") + "\n";
       var blob = new Blob([lines],{type: 'text/plain'});

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



function moba_checker(num)
{
  navigator.webkitPersistentStorage.requestQuota(1024*1024*10, function(bytes)
   {
         window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs)
          {
           // ファイル取得
           fs.root.getFile("moba_coin.txt", {create: true}, function(fileEntry)
          {
             fileEntry.file(function(file)
              {
                  var reader = new FileReader();
                  reader.onloadend = function(e)
                  {
                    data = e.target.result;
                    // console.log(data);
                    if(!data)
                    {
                      console.log("白紙なので、作成します")
                      moba_write(num,0);
                    }
                    else if(data)
                    {
                      var array_temp=data.split("\n");
                      // console.log(array_temp);
                      // var last_time=array_temp[array_temp.length-2].split(",")[0];
                      var last_item_num=array_temp[array_temp.length-2].split(",")[1];
                      console.log(last_item_num);

                      //ここからアップデートが必要かを判断する関数に飛ばす
                      // console.log(last_time);
                      // var flag=update_checker(last_time);
                      if(String(last_item_num)!=String(num))
                      {
                        console.log("更新します");
                        moba_write(num,Number(num)-Number(last_item_num));
                      }
                      else
                      {
                        console.log("更新しない");
                      }
                    }
                  };
                  reader.readAsText(file);
              });
          });
    });
  });
}

function kakin()
{
  console.log("kakin使用してますね");
  /*
  課金ページについたらセレクタ-を取得する
  取得した金額と前の金額が一致しているかを確かめる
  そして変化があればモバコインの金額を記録する
  */
  var test=document.querySelector("body > div.iTextbox_bg.iTextbox_bg_open > dl > dd:nth-child(15)");
  var moba=test.innerText.split(" ")[0];
  console.log(moba);
  moba_checker(moba);

}

// body > div.iTextbox_bg.iTextbox_bg_open > dl > dd:nth-child(15)



kakin();

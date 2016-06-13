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

function memo_write_1(txt,num,dif)
{
  var DD = new Date();
  var Year = DD.getYear()+1900;
  var Month = DD.getMonth() + 1;
  var Day = DD.getDate();
  var Hours = DD.getHours();
  var Minutes = DD.getMinutes();
  var Seconds = DD.getSeconds();
  var date = new Array(Year,Month,Day,Hours,Minutes,Seconds);
  var dates=date.join("/");
  // console.log(dates);
  var utf8num = unescape(encodeURIComponent(num));
  var utf8dif = unescape(encodeURIComponent(dif));

  var txt_name=txt+".txt"
  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024*1024, function(fileSystem){

    fileSystem.root.getFile(txt_name, {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){

        //  ファイルの書き込み位置は、一番最後とする
        fileWriter.seek(fileWriter.length);
        //  出力行
        var lines = '';


        //  0バイトファイルの場合、ヘッダ行を作成する
        if (fileWriter.length == 0)
        {
          var headers = new Array("time",txt,"difference");
          lines = headers.join(",") + "\n";

        }

        //  データ行の作成

       var details = new Array(dates,utf8num,utf8dif);
       lines += details.join(",") + "\n";
       var blob = new Blob([lines],{type: 'text/plain'});

        fileWriter.write(blob);


        fileWriter.onwriteend = function(e) {
          console.log(txt_name+'Write completed.');
        };

        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };

      });
    });
  });
}

function item_checker(txt,num)
{
  var txt_name=txt+".txt"



  navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes)
   {
         window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs)
          {
           // ファイル取得
           fs.root.getFile(txt_name, {create: true}, function(fileEntry)
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
                      memo_write_1(txt,num,0);
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
                        memo_write_1(txt,num,Number(num)-Number(last_item_num));
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


//時間見る関数（今は使っていない）
function update_checker(txt_time)
{
  // console.log(txt_time);
  var update_minute=0;
  //last_timeは前の時間を持つ配列0:年,1:月,2:日,3:時,4:分,5:秒
  var last_time=txt_time.split("/");
  // console.log(last_time[0]);
  //現在時刻の確認
  var DD = new Date();
  var Year = DD.getYear();
  var Month = DD.getMonth() + 1;
  var Day = DD.getDate();
  var Hours = DD.getHours();
  var Minutes = DD.getMinutes();
  var Seconds = DD.getSeconds();
  var date = new Array(Year,Month,Day,Hours,Minutes,Seconds);
  var dates=date.join("/");
  console.log(dates);
  if(Year>last_time[0])//更新する必要あり
  {
    console.log("year更新");
    return true;
  }
  else if(Year==last_time[0])//年が一緒なら次の確認へ
  {
    if(Month>last_time[1])//更新する必要あり
    {
      console.log("month更新");
      return true;
    }
    else if(Month==last_time[1])//月が一緒なら次の確認へ
    {
      if(Day>last_time[2])//更新する必要あり
      {
        console.log("day更新");
        return true;
      }
      else if(Day==last_time[2])//日が一緒なら次の確認へ
      {
        if(Hours>last_time[3])//更新する必要あり
        {
          console.log("hour更新");
          return true;
        }
        else if(Hours==last_time[3])//時が一緒なら次の確認へ
        {
          if(Minutes>Number(last_time[4])+update_minute)//ここはupdate_minuteと足した時間に更新してほしい
          {
            console.log("minute更新");
            return true;
          }
          else if(Minutes==last_time[4])//分まで一緒なら終了
          {
            console.log("更新しません");
            return false;
          }
        }
      }
    }
  }

}


function root_write()
{
  //セレクタ-の配列
    var slector_s=["#top > div:nth-child(5) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(13) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(21) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(29) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(37) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(45) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(53) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(62) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(71) > table > tbody > tr > td:nth-child(2)","#top > div:nth-child(80) > table > tbody > tr > td:nth-child(2)"];

    for(var i=0;i<slector_s.length;i++)
    {
      var t_slector=slector_s[i];
      var test=document.querySelector(t_slector);
      // console.log(test);
      if(test==null)//該当するセレクタ-がなかった場合はスルーする（アイテム以外のURLで発動するはず）
        continue;

      var str=test.innerText.split("\n")
      console.log(str[0]);//何がアイテムあるのかの確認できる

      switch (str[0]) {
        case "スタミナドリンク":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
          //スタドリを記録するファイルを読み取る
          item_checker("stamina",have_num.innerText);
          break;
        case "エナジードリンク":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
            //スタドリを記録するファイルを読み取る
          item_checker("energy",have_num.innerText);
          break;

        case "マイスタドリ・ハーフ":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
            //スタドリを記録するファイルを読み取る
          item_checker("my_stamina_half",have_num.innerText);
          break;
        case "マイエナドリ・ハーフ":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
            //スタドリを記録するファイルを読み取る
          item_checker("my_energy_half",have_num.innerText);
          break;
        case "マイスタミナドリンク":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
          //スタドリを記録するファイルを読み取る
          item_checker("my_stamina",have_num.innerText);
          break;
        case "マイエナジードリンク":
          var t_num_selector=t_slector+">span.pink";
          var have_num=document.querySelector(t_num_selector);
          // console.log(have_num.innerText);
          //スタドリを記録するファイルを読み取る
          item_checker("my_energy",have_num.innerText);
          break;

      }

    }
      // window.alert(test.innerText);
      // $("body").html($("body").html().replace( str[1], "━━━(ﾟ∀ﾟ)━━━" ));
}

function copy_t()
{
  localStorage["keya"]="keys";
  console.log(localStorage["test"]);
}


copy_t();
root_write();
// time_control();

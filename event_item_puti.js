function puti_write(normal_drink,normal_drink_dif,half_drink,half_drink_dif)
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
  var utf8normal = unescape(encodeURIComponent(normal_drink));
  var utf8normal_dif = unescape(encodeURIComponent(normal_drink_dif));
  var utf8half=unescape(encodeURIComponent(half_drink));
  var utf8half_dif=unescape(encodeURIComponent(half_drink_dif));

  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024*1024, function(fileSystem){

    fileSystem.root.getFile("puti.txt", {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){

        //  ファイルの書き込み位置は、一番最後とする
        fileWriter.seek(fileWriter.length);
        //  出力行
        var lines = '';


        //  0バイトファイルの場合、ヘッダ行を作成する
        if (fileWriter.length == 0)
        {
          var headers = new Array("time","normal_drink","normal_dif","half_drink","half_dif");
          lines = headers.join(",") + "\n";

        }

        //  データ行の作成

       var details = new Array(dates,utf8normal,utf8normal_dif,utf8half,utf8half_dif);
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

function puti_checker(normal_drink,half_drink)
{
  navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes)
   {
         window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs)
          {
           // ファイル取得
           fs.root.getFile("puti.txt", {create: true}, function(fileEntry)
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
                      console.log("白紙なので、作成します");
                      puti_write(normal_drink,0,half_drink,0);

                    }
                    else if(data)
                    {
                      var array_temp=data.split("\n");
                      // console.log(array_temp);
                      // var last_time=array_temp[array_temp.length-2].split(",")[0];
                      var last_normal_drink=array_temp[array_temp.length-2].split(",")[1];
                      var last_half_drink=array_temp[array_temp.length-2].split(",")[3];
                      // console.log(last_item_num+","+last_half_drink);

                      //ここからアップデートが必要かを判断する関数に飛ばす
                      // console.log(last_time);
                      // var flag=update_checker(last_time);
                      if(String(last_normal_drink)!=String(normal_drink) || String(last_half_drink)!=String(half_drink))
                      {
                        console.log("更新します");
                        puti_write(normal_drink,Number(normal_drink)-Number(last_normal_drink),half_drink,Number(half_drink)-Number(last_half_drink));
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

function puti_log()
{
  var puti_check=document.querySelector("#top > div.m-Top10 > a > div > span");

  if(!puti_check)
  {
    console.log("プチトップページじゃないですね");
  }
  // console.log(puti_check.innerText);
  else if(puti_check.innerText=="ぷちデレラコレクション演出設定")
  {
    //このときはプチコレのページである
    //よってアイテムを記録することができる
    var normal_drink=document.querySelector("#event_main_graphic > div.event_items > div:nth-child(1)");
    var normal_drink_num=normal_drink.innerText.substr(1);
    console.log(normal_drink_num);

    var half_drink=document.querySelector("#event_main_graphic > div.event_items > div:nth-child(2)");
    var half_drink_num=half_drink.innerText.substr(1);
    console.log(half_drink_num);
    puti_checker(normal_drink_num,half_drink_num);




  }
}
puti_log();
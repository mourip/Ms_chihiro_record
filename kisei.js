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
①規制ページに飛ぶ。この時点でのカウント回数をロードする。
②もし読み込めなかったら新規作成
③読み込めたら次の回数を書きこむ＋時間を書き込む
④時間を書き込む際、最後の書き込みの時間の経過を見る。
これが一分未満の場合は書き込まない
④合計で３０分を経過していた場合は本来記録するべきところに記録をする
*/



function kisei()
{
  var kisei_selector=document.querySelector("#top > h2 > div");
  if(kisei_selector!=null)
  {
    if(kisei_selector.innerText=="通信規制")
    {
      //tempというディレクトリの作成
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

      /*時間ごとに記録する*/
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
          window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
              // ファイル取得
              fs.root.getFile("temp/kisei.txt", {
                  create: true
              }, function(fileEntry) {
                  fileEntry.file(function(file) {
                      var reader = new FileReader();
                      reader.onloadend = function(e) {
                          data = e.target.result;
                          // console.log(data);
                          if (!data) {
                              console.log("temp/kiseki:白紙");
                              // 今のptを記録する関数を作成する
                              temp_kisei_write();
                          } else if (data)
                          {
                            var temp_array=data.split("\n");
                            var last_time=temp_array[temp_array.length-2].split("/");
                            var DD = new Date();
                            var Year = DD.getYear() + 1900;
                            var Month = DD.getMonth() + 1;
                            var Day = DD.getDate();
                            var Hours = DD.getHours();
                            var Minutes = DD.getMinutes();
                            var Seconds = DD.getSeconds();
                            /*
                            これも時間を見て日を超えたらリセット
                            オーバーフローの危険性があるから
                            */

                            var last_time_num=Number(last_time[5])+Number(last_time[4])*60+Number(last_time[3])*3600;

                            var now_time_num=Seconds+Minutes*60+Hours*3600;
                            if(Number(last_time[2])!=Day)
                            {
                              console.log("規制回数：日を超えたのでリセットします");
                              del_kiseki_temp();
                            }
                            if(Number(now_time_num)-Number(last_time_num)>60)
                            {
                              console.log("同じ規制じゃないですね");
                              temp_kisei_write();
                            }
                            else
                            {
                              console.log("同じ規制ですよー");
                              window.alert('同じ規制ですよー');
                            }
                          }
                      }
                      reader.readAsText(file);
                  });
              });
          });
      });
    }
    else
    {
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
          window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
              // ファイル取得
              fs.root.getFile("temp/kisei.txt", {
                  create: true
              }, function(fileEntry) {
                  fileEntry.file(function(file) {
                      var reader = new FileReader();
                      reader.onloadend = function(e) {
                          data = e.target.result;
                          // console.log(data);
                          if (!data) {
                              console.log("temp/kisei:からですわ");
                          } else if (data)
                          {
                            var temp_array=data.split("\n");
                            var start_time=temp_array[0].split("/");
                            var last_time=temp_array[temp_array.length-2].split("/");
                            var DD = new Date();
                            var Year = DD.getYear() + 1900;
                            var Month = DD.getMonth() + 1;
                            var Day = DD.getDate();
                            var Hours = DD.getHours();
                            var Minutes = DD.getMinutes();
                            var Seconds = DD.getSeconds();
                            /*
                            これも時間を見て日を超えたらリセット
                            オーバーフローの危険性があるから
                            */

                            var last_time_num=Number(last_time[5])+Number(last_time[4])*60+Number(last_time[3])*3600;
                            var start_time_num=Number(start_time[5])+Number(start_time[4])*60+Number(start_time[3])*3600;

                            var now_time_num=Seconds+Minutes*60+Hours*3600;
                            if(Number(now_time_num)-Number(start_time_num)>60*30)
                            {
                              console.log("３０分超えてるんで更新します");
                              /*書き込みの準備*/
                              var start_write=data.split("\n")[0];
                              var last_write=data.split("\n")[length-2];
                              var kaisuu=Number(data.split("\n")).length-1

                              var times=String(start_write)+"~"+String(last_write);

                              var elapsed_time=Number(last_time_num)-Number(start_time_num);
                              main_kisei_write(time,elapsed_time,kaisuu)
                            }
                            else
                            {
                              console.log("更新はまだ")
                            }
                          }
                      }
                      reader.readAsText(file);
                  });
              });
          });
      });
    }
  }

}

function temp_kisei_load()
{

  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
      window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
          // ファイル取得
          fs.root.getFile("temp/kisei.txt", {
              create: true
          }, function(fileEntry) {
              fileEntry.file(function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                      data = e.target.result;
                      // console.log(data);
                      if (!data)
                      {
                          console.log("temp/kiseki.txt:白紙");
                          temp_kisei_write();
                      } else if (data)
                      {
                        var last_time=data.split("\n")[length-2].split("/");
                        var DD = new Date();
                        var Year = DD.getYear() + 1900;
                        var Month = DD.getMonth() + 1;
                        var Day = DD.getDate();
                        var Hours = DD.getHours();
                        var Minutes = DD.getMinutes();
                        var Seconds = DD.getSeconds();
                        /*
                        これも時間を見て日を超えたらリセット
                        オーバーフローの危険性があるから
                        */

                        var last_time_num=Number(last_time[5])+Number(last_time[4])*60+Number(last_time[3])*3600;

                        var now_time_num=Seconds+Minutes*60+Hours*3600;
                        if(Number(last_time[2])!=Day)
                        {
                          console.log("規制回数：日を超えたのでリセットします");
                          del_kiseki_temp();
                        }
                        if(Number(now_time_num)-Number(last_time_num)>60)
                        {
                          console.log("同じ規制じゃないですね");
                          temp_kisei_write();
                        }
                        else
                        {
                          console.log("同じ規制ですよー");
                          window.alert('同じ規制ですよー');
                        }

                      }
                  }
                  reader.readAsText(file);
              });
          });
      });
  });
}

function temp_kisei_write()
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
  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){
    fileSystem.root.getFile("temp/kisei.txt", {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){

        //  ファイルの書き込み位置は、一番最後とする
        fileWriter.seek(fileWriter.length);
        //  出力行
        var lines = '';
        //  データ行の作成

       var details = new Array(dates);
       lines += details.join(",") + "\n";
       var blob = new Blob([lines],{type: 'text/plain'});
        fileWriter.write(blob);
        fileWriter.onwriteend = function(e) {
          console.log('temp/kisei.txt:Write completed.');
        };
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };

      });
    });
  });
}

function main_kisei_write(times,elapsed_time,kisei_count)
{
  //tempというディレクトリの作成
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



  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

      fileSystem.root.getFile("etc/kisei.txt", {
          'create': true
      }, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {

              //  ファイルの書き込み位置は、一番最後とする
              fileWriter.seek(fileWriter.length);
              //  出力行
              var lines = '';


              //  0バイトファイルの場合、ヘッダ行を作成する
              if (fileWriter.length == 0) {
                  var headers = new Array("time", "elapsed_time[m]", "count");
                  lines = headers.join(",") + "\n";

              }

              //  データ行の作成

              var details = new Array(time, elapsed_time, kisei_count);
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


function del_kiseki_temp()
{
  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("temp/kisei_count.txt", {'create':false}, function(fileEntry){
      fileEntry.remove(function() {
      console.log('temp/kisei_count.txt:removed.');
      });
    });
  });

  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("temp/kisei.txt", {'create':false}, function(fileEntry){
      fileEntry.remove(function() {
      console.log('temp/kisei.txt:removed.');
      });
    });
  });
}


kisei();

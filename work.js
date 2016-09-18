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

function temp_now_pt_write(pt)
{

  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("temp/now_pt.txt", {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){


        //  出力行
        var lines = pt;
        //  データ行の作成
       var blob = new Blob([lines],{type: 'text/plain'});

        fileWriter.write(blob);
        fileWriter.onwriteend = function(e) {
          console.log('puti:copy completed.');
        };
        fileWriter.onerror = function(e) {
          console.log('puti:copy failed: ' + e.toString());
        };

      });
    });
  });

}


function chi_heal()
{

  var title_selector=document.querySelector("#top > h2 > div")
  // var end_keikennti=document.querySelector("#top > section.t-Cnt.m-Btm0 > div > div:nth-child(3) > span.dark_gray");
  // セレクタ-がnullなら何もしない
  if(title_selector==null)
  {
    console.log("スタのむページじゃない？");
    return false;
  }
  else
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


    var have_pt;
    var bp_chi_heal_selector=document.querySelector("#bp_mic")
    // bpかどうかの確認
    if(bp_chi_heal_selector==null)
    {
      console.log("BPじゃないですね");
    }
    else
    {
      //BPならここで今のptを取得する
      var bp_now=bp_chi_heal_selector.innerText.split(" ")[2];
      var bp_max=bp_chi_heal_selector.innerText.split(" ")[4];
      // console.log("BP");
      have_pt=bp_now;
    }

    // console.log(have_pt);
    /*
    ここに各イベントの際のptを取得するようにする
    */
    if(have_pt==undefined)
    {
      console.log(have_pt);
      /*ファイルを読み込んで今のptを確認する*/
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
          window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
              // ファイル取得
              fs.root.getFile("temp/now_pt.txt", {
                  create: true
              }, function(fileEntry) {
                  fileEntry.file(function(file) {
                      var reader = new FileReader();
                      reader.onloadend = function(e) {
                          data = e.target.result;
                          // console.log(data);
                          if (!data)
                          {
                            console.log("空なのでスルー");
                          } else if (data)
                          {

                              console.log("ちひーるチェッカーを起動します");
                              chi_heal_checker();
                          }
                      }
                      reader.readAsText(file);
                  });
              });
          });
      });
    }

    else if(have_pt!=undefined)
    {
      console.log(have_pt);
      /*ファイルを読み込んで今のptを確認する*/
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
          window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
              // ファイル取得
              fs.root.getFile("temp/now_pt.txt", {
                  create: true
              }, function(fileEntry) {
                  fileEntry.file(function(file) {
                      var reader = new FileReader();
                      reader.onloadend = function(e) {
                          data = e.target.result;
                          // console.log(data);
                          if (!data) {
                              console.log("temp/now_pt.txt:白紙");
                              // 今のptを記録する関数を作成する
                              console.log(have_pt);
                              temp_now_pt_write(have_pt);
                          } else if (data)
                          {
                            //ここに入っているのは１文字だけのハズ
                            var last_pt=Number(data.split("\n")[0])
                            if(Number(have_pt)>last_pt)
                            {
                              console.log("tempと書き込みをします");
                              //差があるということはちひーるが起きている
                              //ptの差がちひーるの起きた回数
                              temp_chi_heal_write(Number(have_pt)-Number(last_pt));
                              temp_now_pt_write(have_pt);
                            }
                            //ptが減る=消費した。tempを更新する
                            else if(Number(have_pt)<last_pt)
                            {
                              console.log("tempだけを更新します")
                              temp_now_pt_write(have_pt);
                            }

                            else if(Number(have_pt)==last_pt)
                            {
                              console.log("ちひーるチェッカーを起動します");
                              chi_heal_checker();
                            }
                          }
                      }
                      reader.readAsText(file);
                  });
              });
          });
      });
    }
    return true;
  }
}


function temp_chi_heal_write(t_pt)
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
  var utf8pt = unescape(encodeURIComponent(t_pt));
  // PRESISTENTで勝手に削除されないようにする
  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){
    fileSystem.root.getFile("temp/chi_heal.txt", {'create':true}, function(fileEntry){
      fileEntry.createWriter(function(fileWriter){

        //  ファイルの書き込み位置は、一番最後とする
        fileWriter.seek(fileWriter.length);
        //  出力行
        var lines = '';




        //  データ行の作成

       var details = new Array(dates,t_pt);
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



function chi_heal_checker()
{

  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
      window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
          // ファイル取得
          fs.root.getFile("temp/chi_heal.txt", {
              create: true
          }, function(fileEntry) {
              fileEntry.file(function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                      data = e.target.result;
                      if(!data)
                      {
                        console.log("空でっせ")
                      }
                      else
                      {
                        var chi_heal_time_temp=data.split("\n");
                        var chi_heal_start=chi_heal_time_temp[0].split(",")[0].split("/");
                        var chi_heal_last=chi_heal_time_temp[chi_heal_time_temp.length-2].split(",")[0].split("/");
                        console.log(chi_heal_last);
                        console.log(chi_heal_start);
                        /*
                        0:y,1:m,2:d,3:h,4:m,5:s
                        今の時間とstart_timeとの比較を行う
                        この時、スタートタイムとの差が30分以上ある場合はlast_timeの時lenghtが30分以内のchi_healの回数になる。
                        この時30分以上であることを求める計算式は+分×1+時×60+日*60*2とする
                        月に変化があればその時点で計測は破棄とする（これ以上計算するとオーバーフローがありえるから）あと月末直後にスタ走りしている人がいないと思うのん

                        */
                        var start_time_num=Number(chi_heal_start[4])+Number(chi_heal_start[3])*60+Number(chi_heal_start[2])*3600;

                        // 現在時刻の計算
                        var DD = new Date();
                        var Year = DD.getYear() + 1900;
                        var Month = DD.getMonth() + 1;
                        var Day = DD.getDate();
                        var Hours = DD.getHours();
                        var Minutes = DD.getMinutes();
                        var Seconds = DD.getSeconds();
                        var now_time_num=Minutes+Hours*60+Day*3600;
                        if(Month!=chi_heal_start[1])
                        {
                          console.log("月が違うので計測中断");
                          /*temp中のファイルを削除する*/
                          del_temp();
                        }
                        if(now_time_num>=start_time_num+10)
                        {
                          console.log("10分たったみたいです");
                          /*
                          まとめるファイルを作成する
                          そのためにどれだけちひーるしたかを計算する
                          */

                          var chi_heal_count=0;
                          //確か最後は改行で空白だから取らないようにする
                          // console.log(chi_heal_time_temp.length);
                          for(var i=0;i<=chi_heal_time_temp.length-2;i++)
                          {
                            var temp=chi_heal_time_temp[i].split(",")[1];
                            // console.log(temp);
                            chi_heal_count+=Number(temp);
                          }

                          /*
                          ここで計算する準備が出来たから書き込む情報を準備する
                          */
                          var write_start=chi_heal_time_temp[0].split(",")[0];
                          var end_time=chi_heal_time_temp[chi_heal_time_temp.length-2].split(",")[0];

                          var write_time_num=Number(chi_heal_last[4])+Number(chi_heal_last[3])*60+Number(chi_heal_last[2])*3600;

                          var elapsed_time=Number(write_time_num)-Number(start_time_num);
                          var times=String(write_start)+"~"+String(end_time);

                          /*ここまでが準備
                          あとは記述用の関数に流すだけ
                          */
                          console.log(times);
                          console.log(elapsed_time);
                          console.log(chi_heal_count);
                          var effect=floatFormat(chi_heal_count/elapsed_time,4);
                          console.log(effect);
                          main_chi_heal_write(times,elapsed_time,chi_heal_count,effect);
                          //書き込みが終わったら不要なのでtempたちを削除する
                          del_temp();
                        }

                      }
                    }
                    reader.readAsText(file);

              });
          });
      });
  });
}

function main_chi_heal_write(time,elapsed_time,chi_heal_count,effect)
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

      fileSystem.root.getFile("etc/chi_heal.txt", {
          'create': true
      }, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {

              //  ファイルの書き込み位置は、一番最後とする
              fileWriter.seek(fileWriter.length);
              //  出力行
              var lines = '';


              //  0バイトファイルの場合、ヘッダ行を作成する
              if (fileWriter.length == 0) {
                  var headers = new Array("time", "elapsed_time[m]", "count","efficiency");
                  lines = headers.join(",") + "\n";

              }

              //  データ行の作成

              var details = new Array(time, elapsed_time, chi_heal_count,effect);
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

function floatFormat( number, n ) {
	var _pow = Math.pow( 10 , n ) ;

	return Math.round( number * _pow ) / _pow ;
}

function del_temp()
{
  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("temp/now_pt.txt", {'create':false}, function(fileEntry){
      fileEntry.remove(function() {
      console.log('temp/now_pt.txt:removed.');
      });
    });
  });

  webkitRequestFileSystem(PERSISTENT, 1024*1024*10, function(fileSystem){

    fileSystem.root.getFile("temp/chi_heal.txt", {'create':false}, function(fileEntry){
      fileEntry.remove(function() {
      console.log('temp/chi_heal.txt:removed.');
      });
    });
  });

}

function kiseki()
{
  var title_selector=document.querySelector("#top > h2 > div")
  if(title_selector!=null)
  {
    if(title_selector.innerText=="通信規制")
    {
      console.log("規制かかったみたいですね");

    }
  }
}




//これで常に回復しているかを監視する
var flager=chi_heal();
// console.log(flager)

//flagerがfalseならお仕事画面以外になっているはず
if(!flager)
{
  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
      window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
          // ファイル取得
          fs.root.getFile("temp/now_pt.txt", {
              create: true
          }, function(fileEntry) {
              fileEntry.file(function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                      data = e.target.result;
                      // console.log(data);
                      if (!data)
                      {
                        console.log("空なのでスルー");
                      } else if (data)
                      {

                          console.log("ちひーるチェッカーを起動します");
                          chi_heal_checker();
                      }
                  }
                  reader.readAsText(file);
              });
          });
      });
  });
  // console.log("out");

}

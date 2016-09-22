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

/*
event_top.jsが提供する機能
1.イベントトップページにあるポイントと順位の記録
2.古いイベントは各old_resultに保存
3.イベントトップページに保存されているアイテムの記録（実装予定）
 */

/*
イベント名
チャレンジ:challenge
フェス:fes
ロワイヤル:royale
 */


/*
各イベントでの追加作業
1.directory_rootにold_event/イベント名を追加
2.event_checkerにイベントのidを追加
3.イベント名_log()を追加
修正点はセレクター類
 */


//ファイルの書式
//日付　ポイント　その差　順位　その差//日付の書式4桁~4桁とする（あとでファイルの処理がやりやすい）

//注意点
//次の年に同じイベントが来ることは想定していないためold_resultのファイルの日程がかぶる可能性がある（アニバーサリーについてはそのとき考える）



/*チャレに関する関数*/

function challenge_log() {


    //現在のポイントの処理を行う
    //総合ポイントのセレクタ-。これは毎回変える必要があると思う
    // 0ptのときとはセレクタ-が違う可能性あり。一応稼いでからじゃないと記録できない。
    var pt_selector = document.querySelector("#top > section.t-Cnt > div:nth-child(3) > div > section > ul:nth-child(8) > li:nth-child(3)");

    //,区切りが嫌であるのでなんとかして変更する
    var pt_str = pt_selector.innerText.split(" ")[2]
    var pt = "";
    // console.log(pt_str);
    if (pt_selector) {
        if (isNaN(pt_str)) //,が含まれている時はNAN(Not a Number)として判定される
        {
            var pt_array = pt_str.split(",");
            for (var i = 0; i < pt_array.length; i++) {
                pt += String(pt_array[i]);
            }

        } else //,が含まれいないときはこっち
        {
            pt = pt_str;
        }
    }

    var now_pt = pt;
    var rank = document.querySelector("#top > section.t-Cnt > div:nth-child(3) > div > section > ul:nth-child(8) > li:nth-child(1)").innerText.split(":")[1];

    // 位を削除する
    var now_rank_n = rank.substr(0, rank.length - 1);

    pt_checker("event/challenge.txt",now_pt,now_rank_n);

    //ここからアイテムの記録に関する処理(セレクターを変更する)
    var normal_drink_num = document.querySelector("#idol_stage_slide > div:nth-child(3) > ul > li:nth-child(1) > div > div.event_items > div:nth-child(1)").innerText.split("×")[1];
    // console.log(normal_drink_num);
    var half_drink_num = document.querySelector("#idol_stage_slide > div:nth-child(3) > ul > li:nth-child(1) > div > div.event_items > div:nth-child(2)").innerText.split("×")[1];
    // console.log(half_drink_num);
    item_checker("event_item/CP.txt", normal_drink_num);
    item_checker("event_item/CP_half.txt", half_drink_num);
}

/*フェスに関する関数*/

function fes_log() {

    console.log("fesのログですね");


    //現在のポイントの処理を行う
    //総合ポイントのセレクタ-。これは毎回変える必要があると思う
    // 0ptのときとはセレクタ-が違う可能性あり。一応稼いでからじゃないと記録できない。
    var pt_selector = document.querySelector("#top > section.m-Btm5 > div.area_tab_2 > section > ul:nth-child(2) > li:nth-child(3)");

    //,区切りが嫌であるのでなんとかして変更する
    var pt_str = pt_selector.innerText.split(" ")[2]
    var pt = "";
    // console.log(pt_str);
    if (pt_selector) {
        if (isNaN(pt_str)) //,が含まれている時はNAN(Not a Number)として判定される
        {
            var pt_array = pt_str.split(",");
            for (var i = 0; i < pt_array.length; i++) {
                pt += String(pt_array[i]);
            }

        } else //,が含まれいないときはこっち
        {
            pt = pt_str;
        }
    }

    var now_pt = pt;
    var rank = document.querySelector("#top > section.m-Btm5 > div.area_tab_2 > section > ul:nth-child(2) > li:nth-child(1)").innerText.split(":")[1];

    // 位を削除する
    var now_rank_n = rank.substr(0, rank.length - 1);

    //ポイントに関して記述することを想定する
    pt_checker("event/fes.txt",now_pt,now_rank_n);

    //ここからアイテムの記録に関する処理(セレクターを変更する)
    var energy_num = document.querySelector("#top > section.event_main_graphic.pmf_top_bgArea > div.event_items > div:nth-child(2)").innerText.split("×")[1];
    // console.log(normal_drink_num);
    var my_energy_num = document.querySelector("#top > section.event_main_graphic.pmf_top_bgArea > div.event_items > div:nth-child(3)").innerText.split("×")[1];
    var my_energy_half_num = document.querySelector("#top > section.event_main_graphic.pmf_top_bgArea > div.event_items > div:nth-child(4)").innerText.split("×")[1];
    // console.log(half_drink_num);
    item_checker("item/energy.txt", energy_num);
    item_checker("item/my_energy.txt", my_energy_num);
    item_checker("item/my_energy_half.txt", my_energy_half_num);
}


/*以下5つの関数はすべてのイベントで共通の処理を行う*/
//削除するための関数
function delete_files(input_file) {
    // PRESISTENTで勝手に削除されないようにする
    var txt_name = input_file;
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

        fileSystem.root.getFile(txt_name, {
            'create': false
        }, function(fileEntry) {
            fileEntry.remove(function() {
                console.log('File removed.');
            });
        });
    });
}

// コピーしたデータを書き込む処理
function copy_data_write(input_file, output_file, data) {
    // console.log(data);
    var txt_name = output_file;

    // PRESISTENTで勝手に削除されないようにする
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

        fileSystem.root.getFile(txt_name, {
            'create': true
        }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {


                //  出力行
                var lines = data;
                //  データ行の作成
                var blob = new Blob([lines], {
                    type: 'text/plain'
                });

                fileWriter.write(blob);
                fileWriter.onwriteend = function(e) {
                    console.log(txt_name + ':copy completed.');
                };
                fileWriter.onerror = function(e) {
                    console.log(txt_name + ':copy failed: ' + e.toString());
                };

            });
        });
    });
    delete_files(input_file);
}

//コピーしたいデータを読み込むための処理
function copy_data_read(input_file, output_file) {
    var txt_name = input_file
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        var txt_t = txt_name;
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            var txt_name1 = txt_t;
            // ファイル取得
            fs.root.getFile(txt_name, {
                    create: false
                },
                function(fileEntry) {
                    var txt_name2 = txt_name1;
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            data = e.target.result;
                            console.log(data);
                            console.log(String(txt_name2));
                            copy_data_write(txt_name2, output_file, data);
                        };
                        reader.readAsText(file);
                    });
                },
                function(err) {
                    // console.log(err);
                });
        });
    });

}

//アイテムデータを読み込む関数
function item_checker(filename, drink_num) {
  console.log(filename+"確認");
  navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
      window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
          // ファイル取得
          fs.root.getFile(filename, {
              create: true
          }, function(fileEntry) {
              fileEntry.file(function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                      data = e.target.result;
                      // console.log(data);
                      if (!data) {
                          console.log("白紙なので、作成します")
                          item_writer(filename, drink_num, 0);
                      } else if (data) {
                          var array_temp = data.split("\n");
                          var last_item_num = array_temp[array_temp.length - 2].split(",")[1];
                          console.log(last_item_num);

                          //ここからアップデートが必要かを判断する関数に飛ばす
                          if (String(last_item_num) != String(drink_num)) {
                              console.log("更新します");
                              item_writer(filename, Number(drink_num), Number(drink_num) - Number(last_item_num));
                          } else {
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

//アイテムを記録するための関数
function item_writer(filename, drink_num, drink_dif) {
    console.log(filename+"記述");
    var num=drink_num;
    var dif=drink_dif;
    var DD = new Date();
    var Year = DD.getYear() + 1900;
    var Month = DD.getMonth() + 1;
    var Day = DD.getDate();
    var Hours = DD.getHours();
    var Minutes = DD.getMinutes();
    var Seconds = DD.getSeconds();
    var date = new Array(Year, Month, Day, Hours, Minutes, Seconds);
    var dates = date.join("/");
    // console.log(dates);
    var utf8num = unescape(encodeURIComponent(num));
    var utf8dif = unescape(encodeURIComponent(dif));

    var txt_name =filename;
    var header_kind=filename.split("/")[1].split(".")[0];
        // PRESISTENTで勝手に削除されないようにする
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024*5, function(fileSystem) {

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
                    var headers = new Array("time", header_kind, "difference");
                    lines = headers.join(",") + "\n";

                }

                //  データ行の作成

                var details = new Array(dates, utf8num, utf8dif);
                lines += details.join(",") + "\n";
                var blob = new Blob([lines], {
                    type: 'text/plain'
                });

                fileWriter.write(blob);


                fileWriter.onwriteend = function(e) {
                    console.log(txt_name + 'Write completed.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

            });
        });
    });
}

// ポイントを読み込むための関数
function pt_checker(filename,now_pt,now_rank_n){
    var start_end_day=header_to_date();
    console.log(filename+"確認");
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            // ファイル取得
            fs.root.getFile(filename, {
                create: true
            }, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        data = e.target.result;
                        // console.log(data);
                        if (!data) {
                            console.log(filename+":白紙なので、作成します");
                            pt_write(filename,now_pt, 0, now_rank_n, 0);

                        } else if (data) {
                            // データのすべてを得る

                            var array_temp = data.split("\n");
                            // 最初の行にある日付と今のイベントの日付が一致しない場合はファイルのコピーを行う
                            var first_line = array_temp[0];
                            if (first_line != start_end_day) {
                                // 旧データ群はold_resultに入れる
                                console.log(filename+":古いデータなのでコピーする")
                                //出力ファイル名
                                var file_start_d=first_line.split("~")[0];
                                var output_file_name =  file_start_d+".txt";
                                // 現在のファイル名からイベント名を取得する
                                // event/fes.txt
                                var event_name=filename.split("/")[1].split(".")[0];
                                output_file="old_event/"+event_name+"/"+output_file_name;
                                // コピー対象のファイルを読み込む
                                copy_data_read(filename, output_file);
                            } else {
                                //最後の行をみて書くかどうかを判断する
                                //最後のポイントを取得する
                                var last_pt = array_temp[array_temp.length - 2].split(",")[1];
                                //最後の順位を取得する
                                var last_rank = array_temp[array_temp.length - 2].split(",")[3];
                                // console.log(last_item_num+","+last_half_drink);

                                //ポイントと順位のいずれかが違う場合は更新する
                                if (String(last_pt) != String(now_pt) || String(last_rank) != String(now_rank_n)) {
                                    console.log(filename+":更新します");
                                    pt_write(filename,now_pt, Number(now_pt) - Number(last_pt), now_rank_n, Number(last_rank) - Number(now_rank_n));
                                } else {
                                    console.log("更新しない");
                                }
                            }
                        }
                    };
                    reader.readAsText(file);
                });
            });
        });
    });
}

// ポイントを記録するための関数
function pt_write(filename,pt,pt_dif,rank,rank_dif){

    // 現在の日付の取得
    var DD = new Date();
    var Year = DD.getYear() + 1900;
    var Month = DD.getMonth() + 1;
    var Day = DD.getDate();
    var Hours = DD.getHours();
    var Minutes = DD.getMinutes();
    var Seconds = DD.getSeconds();
    var date = new Array(Year, Month, Day, Hours, Minutes, Seconds);
    var dates = date.join("/");
    // console.log(dates);
    var utf8pt = unescape(encodeURIComponent(pt));
    var utf8pt_dif = unescape(encodeURIComponent(pt_dif));
    var utf8rank = unescape(encodeURIComponent(rank));
    var utf8rank_dif = unescape(encodeURIComponent(rank_dif));

    //ヘッダー行のからのイベント期間の取得
    var headers_text = document.querySelector("#event_header_info").innerText.split(" ");
    var start_day = headers_text[1].split("/");
    var end_day = headers_text[2].split("～")[1].split("/");

    var start_end_day = header_to_date();
    // PRESISTENTで勝手に削除されないようにする
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

        fileSystem.root.getFile(filename, {'create': true},function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                //  ファイルの書き込み位置は、一番最後とする
                fileWriter.seek(fileWriter.length);
                //  出力行
                var lines = '';
                //  0バイトファイルの場合、ヘッダ行を作成する
                if (fileWriter.length == 0) {
                    var headers = new Array("time", "pt", "pt_dif", "rank", "rank_dif");
                    lines = start_end_day + "\n" + headers.join(",") + "\n";

                }

                //  データ行の作成

                var details = new Array(dates, utf8pt, utf8pt_dif, utf8rank, utf8rank_dif);
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

//ヘッダーから日付を得るための関数
function header_to_date(){
    var headers_text = document.querySelector("#event_header_info").innerText.split(" ");
    var start_day = headers_text[1].split("/");
    var end_day = headers_text[2].split("～")[1].split("/");
    // 月と日を2桁の数に変換していく

    // 1スタートの月の変換
    var start_day_m = "";
    if (Number(start_day[0]) < 10) {
        start_day_m = "0" + start_day[0];
    } else {
        start_day_m = start_day[0];
    }
    // 2スタートの日の変換
    var start_day_d = ""
    if (Number(start_day[1]) < 10) {
        start_day_d = "0" + start_day[1];
    } else {
        start_day_d = start_day[1];
    }

    // 3エンドの月の変換
    var end_day_m = "";
    if (Number(end_day[0]) < 10) {
        end_day_m = "0" + end_day[0];
    } else {
        end_day_m = end_day[0];
    }
    // 4エンドの日の変換
    var end_day_d = ""
    if (Number(end_day[1]) < 10) {
        end_day_d = "0" + end_day[1];
    } else {
        end_day_d = end_day[1];
    }

    var start_end_day = start_day_m + start_day_d + "~" + end_day_m + end_day_d
    return start_end_day;
}



//ディレクトリを作成するための関数
function directry_root() {
    // 通常アイテムを管理するitemフォルダを作成するための処理
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("event", {
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

    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("old_event", {
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

    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("old_event/challenge", {
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
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("old_event/fes", {
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
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("event_item", {
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
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("item", {
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




    /*
    var arrays = ["stamina", "energy", "my_stamina_half", "my_energy_half", "my_stamina", "my_energy"];
    // console.log(arrays);
    // データの引き継ぎ用の処置（そろそろいらない気がする）
    for (var i = 0; i < arrays.length; i++) {
        copy_data_write(String(arrays[i]));
        // delete_files(arrays[i]);
    }
    */

}
// イベントが何であるかを判定する関数
function event_checker() {

    if (document.querySelector("#event_challenge") != null)
        challenge_log();
    else if (document.querySelector("#event_pmf") != null)
        fes_log();
}


//トップページのみ動作する
if(document.querySelector("#event_header_info")!=null){
    directry_root();
    event_checker();
}

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

function rowa_write(normal_drink, normal_drink_dif, half_drink, half_drink_dif) {
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
    var utf8normal = unescape(encodeURIComponent(normal_drink));
    var utf8normal_dif = unescape(encodeURIComponent(normal_drink_dif));
    var utf8half = unescape(encodeURIComponent(half_drink));
    var utf8half_dif = unescape(encodeURIComponent(half_drink_dif));

    // PRESISTENTで勝手に削除されないようにする
    webkitRequestFileSystem(PERSISTENT, 1024 * 1024 * 10, function(fileSystem) {

        fileSystem.root.getFile("event_items/rowa.txt", {
            'create': true
        }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                //  ファイルの書き込み位置は、一番最後とする
                fileWriter.seek(fileWriter.length);
                //  出力行
                var lines = '';


                //  0バイトファイルの場合、ヘッダ行を作成する
                if (fileWriter.length == 0) {
                    var headers = new Array("time", "normal_drink", "normal_dif", "half_drink", "half_dif");
                    lines = headers.join(",") + "\n";

                }

                //  データ行の作成

                var details = new Array(dates, utf8normal, utf8normal_dif, utf8half, utf8half_dif);
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

function rowa_checker(normal_drink, half_drink) {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            // ファイル取得
            fs.root.getFile("event_items/rowa.txt", {
                create: true
            }, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        data = e.target.result;
                        // console.log(data);
                        if (!data) {
                            console.log("白紙なので、作成します");
                            rowa_write(normal_drink, 0, half_drink, 0);

                        } else if (data) {
                            var array_temp = data.split("\n");
                            // console.log(array_temp);
                            // var last_time=array_temp[array_temp.length-2].split(",")[0];
                            var last_normal_drink = array_temp[array_temp.length - 2].split(",")[1];
                            var last_half_drink = array_temp[array_temp.length - 2].split(",")[3];
                            // console.log(last_item_num+","+last_half_drink);

                            //ここからアップデートが必要かを判断する関数に飛ばす
                            // console.log(last_time);
                            // var flag=update_checker(last_time);
                            if (String(last_normal_drink) != String(normal_drink) || String(last_half_drink) != String(half_drink)) {
                                console.log("更新します");
                                rowa_write(normal_drink, Number(normal_drink) - Number(last_normal_drink), half_drink, Number(half_drink) - Number(last_half_drink));
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

function pt_checker_rowa(rowa_pt) {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getDirectory("event_pt", {
                    create: true
                },
                function(dirEntry) {
                    var text = "ディレクトリパス：" + dirEntry.fullPath;
                    console.log(text);
                    //text += "ディレクトリ名："+dirEntry.name+"<br>";
                    //document.getElementById("result").innerHTML = text;
                },
                function(err) { // 失敗時のコールバック関数
                    console.log(err);
                });
        });
    });

    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 10, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            // ファイル取得
            fs.root.getFile("event_pt/rowa.txt", {
                create: true
            }, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        data = e.target.result;
                        // console.log(data);
                        if (!data) {
                            console.log("白紙なので、作成します");
                            rowa_write_pt(pt, 0);

                        } else if (data) {
                            var array_temp = data.split("\n");
                            //year/month/day/hour/minute/second/の順で得られる
                            var last_time_all = array_temp[array_temp.length - 2].split(",")[0];
                            var last_time_pt = array_temp[array_temp.length - 2].split(",")[1];
                            //これで配列が得られる
                            var last_time_each = last_time_all.split("/");

                            var renew_flag = false;

                            //今の時刻を得る
                            var DD = new Date();
                            var Year = DD.getYear() + 1900;
                            var Month = DD.getMonth() + 1;
                            var Day = DD.getDate();
                            var Hours = DD.getHours();
                            var Minutes = DD.getMinutes();
                            var Seconds = DD.getSeconds();

                            //今のじ





                        } else {
                            console.log("更新しない");
                        }
                    }
                });
                reader.readAsText(file);
            });
        });
    });
}



function rowa_log() {
    var rowa_check = document.querySelector("#event_header_info > div > div:nth-child(2) > span");


    // console.log(rowa_check.innerText);
    if (rowa_check.innerText == "BP") {
        navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function(bytes) {
            window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
                fs.root.getDirectory("event_items", {
                        create: true
                    },
                    function(dirEntry) {
                        var text = "ディレクトリパス：" + dirEntry.fullPath;
                        console.log(text);
                        //text += "ディレクトリ名："+dirEntry.name+"<br>";
                        //document.getElementById("result").innerHTML = text;
                    },
                    function(err) { // 失敗時のコールバック関数
                        console.log(err);
                    });
            });
        });
        //このときはロワのページである
        //よってアイテムを記録することができる
        // イベントの生ドリンク（これは全てのイベントで共通？
        var normal_drink = document.querySelector("#top > section.event_main_graphic > div.event_items > div:nth-child(1)");

        // 部分文字列の取得。これで余分な×を消せる
        var normal_drink_num = normal_drink.innerText.substr(1);
        console.log(normal_drink_num);

        // イベントのハーフドリンク。これはイベントによって共通ではない？
        var half_drink = document.querySelector("#top > section.event_main_graphic > div.event_items > div:nth-child(2)");
        var half_drink_num = half_drink.innerText.substr(1);
        console.log(half_drink_num);
        rowa_checker(normal_drink_num, half_drink_num);

        //総合ポイントのセレクタ-。これは毎回変える必要があると思う
        // 0ptのときとはセレクタ-が違う可能性あり。一応稼いでからじゃないと記録できない。
        var pt_selector = document.querySelector("#top > section:nth-child(14) > div.area_tab.t-Cnt > section > ul:nth-child(8) > li:nth-child(3)");

        //,区切りが嫌であるのでなんとかして変更する
        var pt_str = pt_selector.innerText.split(":")[1]
            // console.log(pt_str);
        if (pt_selector) {
            if (isNaN(pt_str)) //,が含まれている時はNAN(Not aNumber)として判定される
            {
                var pt_array = pt_str.split(",");
                var pt = "";
                for (var i = 0; i < pt_array.length; i++) {
                    pt += String(pt_array[i]);
                }
                console.log(pt);
                //pt_checker_rowa(pt);
            } else //,が含まれいないときは
            {
                console.log(pt_str);
            }


        } else {
            console.log("ptをしめすセレクタ-がありません");
        }
    }

}

//directry_root_rowa();
rowa_log();


function pt_test() {
    var nan = "123,456";
    var nan2 = "123"
    if (isNaN(nan)) {
        console.log("数字じゃないですよ");
    }


}

// pt_test();

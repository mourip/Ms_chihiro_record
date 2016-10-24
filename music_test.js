function music_test(){
  //音声処理
		var soundSrc = "dame.mp3";
		if (soundSrc){
        console.log("aaaa");
			var playsrc = null;
			playsrc = chrome.extension.getURL( ("./sound/"+soundSrc) );	//任意の場所というかpath的な
			var audio = new Audio("");
			audio.src = playsrc;	//URL
			audio.volume = (100 / 100);	//30%のぼりゅーむ？]
			audio.play();
		}

}

// music_test();

console.log("\n %c HeoMusic 开源静态音乐播放器 v1.5 %c https://github.com/zhheo/HeoMusic \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")
console.log("\n %c 播放本地音乐 By 皇家元林 %c https://hjyl.org \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")

var heoMusicPage = document.getElementById("heoMusic-page");
heoMusicPage.innerHTML = `<meting-js><div id="app"></div></meting-js>`;
var aplayer = new APlayer({
  container: document.getElementById("app"),
  lrcType: 3,
  order: 'random',
  preload: 'auto',
  mutex: true,
  theme: '#b7daff'
});
volume = aplayer.volume(0.5,true);

var heo = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    const heoMusicBg = document.getElementById("music_bg")

    if (isChangeBg) {
      // player loadeddata 会进入此处
      const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
      var img = new Image();
      img.src = extractValue(musiccover.style.backgroundImage);
      img.onload = function() {
        heoMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
      };
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(()=>{
        const musiccover = document.querySelector("#heoMusic-page .aplayer-pic");
        // 确保player加载完成
        // console.info(heoMusicBg);
        if (musiccover) {
          clearInterval(timer)
          //初始化音量
          aplayer.volume(0.5,true);
          // 绑定事件
          heo.addEventListenerChangeMusicBg();
        }
      }, 100)
    }
  },
  addEventListenerChangeMusicBg: function () {
    aplayer.on('loadeddata', function () {
      heo.changeMusicBg();
      // console.info('player loadeddata');
    });
  },
  getCustomPlayList: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', './music.json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4){
        if (xhr.status === 200){
          musicList = JSON.parse(xhr.responseText);
          //console.info(musicList);
          aplayer.list.add(musicList);
        } else {
        alert('很抱歉，没有获取到音乐数据哦~')
        }
      }
    }
    xhr.send();
    heo.changeMusicBg(false);
}
}

// 调用
heo.getCustomPlayList();


// 改进vh
const vh = window.innerHeight * 1;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 1;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

//获取图片url
function extractValue(input) {
  var valueRegex = /\("([^\s]+)"\)/g;
  var match = valueRegex.exec(input);
  return match[1];
}

//空格控制音乐
document.addEventListener("keydown", function(event) {
  //暂停开启音乐
  if (event.code === "Space") {
    event.preventDefault();
    aplayer.toggle();
  };
  //切换下一曲
  if (event.keyCode === 39) {
    event.preventDefault();
    aplayer.skipForward();
  };
  //切换上一曲
  if (event.keyCode === 37) {
    event.preventDefault();
    aplayer.skipBack();
  }
  //增加音量
  if (event.keyCode === 38) {
    if (volume <= 1) {
      volume += 0.1;
      aplayer.volume(volume,true);
    }
  }
  //减小音量
  if (event.keyCode === 40) {
    if (volume >= 0) {
      volume += -0.1;
      aplayer.volume(volume,true);
    }
  }
});
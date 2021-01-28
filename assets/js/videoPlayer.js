const videoContainer = document.getElementById("jsVideoPlayer");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const videoPlayer = document.querySelector("video");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method:"POST"
  });
}

function exitFullScreen() {
   fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
   fullScrnBtn.addEventListener("click", goFullScreen);
   if (document.exitFullscreen) {
     document.exitFullscreen();
   } else if (document.mozCancelFullScreen) {
     document.mozCancelFullScreen();
   } else if (document.webkitExitFullscreen) {
     document.webkitExitFullscreen();
   } else if (document.msExitFullscreen) {
     document.msExitFullscreen();
   }
 }

 function goFullScreen() {
   if (videoContainer.requestFullscreen) {
     videoContainer.requestFullscreen();
   } else if (videoContainer.mozRequestFullScreen) {
     videoContainer.mozRequestFullScreen();
   } else if (videoContainer.webkitRequestFullscreen) {
     videoContainer.webkitRequestFullscreen();
   } else if (videoContainer.msRequestFullscreen) {
     videoContainer.msRequestFullscreen();
   }
   fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
   fullScrnBtn.removeEventListener("click", goFullScreen);
   fullScrnBtn.addEventListener("click", exitFullScreen);
 }

function handleVolumeClick(){
    if(videoPlayer.muted){
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
       } else{
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function handlePlayClick(){
    if(videoPlayer.paused){
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }else{
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
         totalSeconds = `0${totalSeconds}`;
    }
    if(hours < 1){
      return `${minutes}:${totalSeconds}`;      
    } else {
      return `${hours}:${minutes}:${totalSeconds}`;
    }
};

const setCurrentTime = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  const hours = Math.floor(secondsNumber / 3600);
  if(hours < 1){
    return `00:00`;      
  } else {
    return `00:00:00`;
  }
}

function getCurrentTime(){
    currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime(){
    const totalTimeStr = formatDate(videoPlayer.duration);
    totalTime.innerHTML = totalTimeStr;
    const curTimeStr = setCurrentTime(videoPlayer.duration);
    currentTime.innerHTML = curTimeStr;
}

function handleEnded(){
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event){
  const {
    target: { value}
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6){
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>'
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>'
  }
}


function init(){
    videoPlayer.volume=0.5;
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click",goFullScreen);
	  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("timeupdate", getCurrentTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
}

if(videoContainer){
    init();
}
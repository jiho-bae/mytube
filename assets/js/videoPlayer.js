const videoContainer = document.getElementById("jsVideoPlayer");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
let videoPlayer;

function exitFullScreen(){
    fullScrnBtn.innerHTML='<i class="fas fa-expand"></i>';
    fullScrnBtn.removeEventListener("click",exitFullScreen);    
    fullScrnBtn.addEventListener("click",goFullScreen);
    document.exitFullscreen();
}

function goFullScreen(){
    videoContainer.requestFullscreen();
    fullScrnBtn.innerHTML='<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click",goFullScreen);
    fullScrnBtn.addEventListener("click",exitFullScreen);
}

function handleVolumeClick(){
    if(videoPlayer.muted){
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else{
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

function init(){
    videoPlayer = videoContainer.querySelector("video");
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click",goFullScreen);
}

if(videoContainer){
    init();
}
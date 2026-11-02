// audio.js
// handles what the player hears

const playMusic = document.getElementById("playMusic");
const bgMusic = new Audio("./audio/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.15;
const musicName = bgMusic.src;
function startMusic() {
  console.log("Music playing:", musicName);
  bgMusic.play();
}
if (playMusic) {
  playMusic.addEventListener("click", startMusic);
}
//* Deleted the music FOR NOW, since its lagging everything up

// audio.js
// handles what the player hears

const playMusic = document.getElementById("playMusic");
const bgMusic = new Audio("./audio/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.15;

function startMusic() {
  console.log("Music playing:", Audio("./audio/music.mp3"));
  bgMusic.play();
}

playMusic.addEventListener("click", startMusic);

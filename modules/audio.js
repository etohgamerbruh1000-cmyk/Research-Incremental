// audio.js
// handles what the player hears

const playMusic = document.getElementById("playMusic");
const bgMusic = new Audio("./audio/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.15;

function startMusic() {
  console.log("Music playing:", "sunshine in my bed :DDDDDD");
  bgMusic.play();
}

playMusic.addEventListener("click", startMusic);

//* Deleted the music FOR NOW, since its lagging everything up

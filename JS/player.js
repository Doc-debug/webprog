import { crawler } from "./crawler.js";
import { initSonglist, getSonglist } from "./songlist.js";
("use strict");

window.onload = async function () {
  let data = await crawler();
  initSonglist();
  initPlayer();
};

let playing,
  player,
  loop,
  shuffle,
  btnPlayPause,
  btnLoop,
  btnShuffle,
  btnSkip,
  btnBack,
  songlist,
  selectedSong;

function initPlayer() {
  //init player variables
  player = new Audio();
  playing = false;
  loop = false;
  shuffle = false;
  songlist = getSonglist();
  selectedSong = 0;

  //init buttons
  btnPlayPause = document.getElementById("play-control");
  btnSkip = document.getElementById("skip-control");
  btnBack = document.getElementById("back-control");
  btnShuffle = document.getElementById("shuffle-control");
  btnLoop = document.getElementById("loop-control");

  //adding event listeners to buttons
  btnPlayPause.addEventListener("click", function () {
    switchPlayPause();
  });
  btnSkip.addEventListener("click", function () {
    audioSkip();
  });
  btnBack.addEventListener("click", function () {
    audioBack();
  });
  btnShuffle.addEventListener("click", function () {
    audioShuffle();
  });
  btnLoop.addEventListener("click", function () {
    audioLoop();
  });

  //init first song
  player.src = songlist[selectedSong]["url"];
  updateSongInfo();
}

//Switch for play and pause
function switchPlayPause() {
  if (playing) {
    audioPause();
  } else {
    audioPlay();
  }
}

//Set player to play
function audioPlay() {
  playing = true;
  player.play();
}

//Set player to pause
function audioPause() {
  playing = false;
  player.pause();
}

//Skipping song
function audioSkip() {
  //Skip to the next song if possible else restart songlist and pause
  if (songlist[selectedSong + 1] != null) {
    player.src = songlist[selectedSong++]["url"];
    updateSongInfo();
  } else {
    selectedSong = 0;
    player.src = songlist[selectedSong]["url"];
    updateSongInfo();
    if (playing) {
      player.pause();
    }
  }
}

//Got to song start or a song back
function audioBack() {
  //Restart song or go a song back
  if (player.currentTime > 3 || selectedSong == 0) {
    player.currentTime = 0;
  } else {
    player.src = songlist[selectedSong--]["url"];
    updateSongInfo();
  }
}

//Switches shuffle
function audioShuffle() {
  //TODO
}

//Switching loop control
function audioLoop() {
  loop = !loop;
  player.loop = loop;
  if (loop) {
    //ToDo svg in --contrast
  }
}

//Set volume
//@param volume from 0.0 to 1.0
function audioVolume(volume) {
  player.volume = volume;
}

function updateSongInfo() {
  let songInfo = document.getElementById("song-info");
  songInfo.childNodes[1].innerHTML = songlist[selectedSong]["title"];
  songInfo.childNodes[3].innerHTML = songlist[selectedSong]["artist"];
}

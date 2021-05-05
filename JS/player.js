import { crawler } from "./crawler.js";
import { initSonglist, songlist } from "./songlist.js";
import { arrSort, arrShuffle, arrClone } from "./util/object.js";
("use strict");

window.onload = async function () {
    let data = await crawler();
    initSonglist();
    initPlayer();
};

let playing,
    player,
    playerlist,
    playingPos,
    currentTrack,
    loop,
    shuffle,
    btnPlayPause,
    btnLoop,
    btnShuffle,
    btnSkip,
    btnBack,
    btnMute,
    imgPlayPause,
    songSlider,
    volumeSlider;

function initPlayer() {
    //init player
    player = new Audio();
    playing = false;
    loop = false;
    shuffle = false;
    updateSonglist();
    currentTrack = playerlist[0];
    player.src = currentTrack["url"];
    playingPos = 0;
    player.volume = 0.3;
    player.addEventListener("ended", function () {
        audioSkip();
    });

    //init buttons
    btnPlayPause = document.getElementById("play-control");
    btnSkip = document.getElementById("skip-control");
    btnBack = document.getElementById("back-control");
    btnShuffle = document.getElementById("shuffle-control");
    btnLoop = document.getElementById("loop-control");
    btnMute = document.getElementById("mute-control");

    //init playPauseImg
    imgPlayPause = btnPlayPause.childNodes[1];

    //init songSlider
    songSlider = document.getElementById("song-slider");
    songSlider.oninput = function () {
        var x = songSlider.value;
        var sliderBackground =
            "linear-gradient(90deg, var(--contrast) " +
            x +
            "%, var(--bg-tertionary)" +
            x +
            "%)";
        songSlider.style.background = sliderBackground;
    };

    //init volumeSlider
    volumeSlider = document.getElementById("volume-control");
    volumeSlider.oninput = function () {
        var x = volumeSlider.value;
        var sliderBackground =
            "linear-gradient(90deg, var(--contrast) " +
            x +
            "%, var(--bg-tertionary)" +
            x +
            "%)";
        volumeSlider.style.background = sliderBackground;
    };
    volumeSlider.addEventListener("mousemove", function () {
        audioVolume(volumeSlider.value / 100);
    });

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
    btnMute.addEventListener("click", function () {
        audioMuteSwitch();
    });

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
    imgPlayPause.src = "../img/ctrl/pause.svg";
}

//Set player to pause
function audioPause() {
    playing = false;
    player.pause();
    imgPlayPause.src = "../img/ctrl/play.svg";
}

//Skipping song
function audioSkip() {
    //Skip to the next song if possible else restart songlist and pause
    if (playerlist[playingPos + 1] != null) {
        currentTrack = playerlist[++playingPos];
        player.src = currentTrack["url"];
        updateSongInfo();
        audioPlay();
    } else {
        playingPos = 0;
        currentTrack = playerlist[playingPos];
        player.src = currentTrack["url"];
        updateSongInfo();
        if (playing) {
            audioPause();
        }
    }
}

//Got to song start or a song back
function audioBack() {
    //Restart song or go a song back
    if (player.currentTime < 3 || playingPos == 0) {
        player.currentTime = 0;
    } else {
        currentTrack = playerlist[--playingPos];
        player.src = currentTrack["url"];
        updateSongInfo();
        player.play();
    }
}

//Switches shuffle
function audioShuffle() {
    if (shuffle) {
        playerlist = arrSort(playerlist, "index", 1);
        playingPos = currentTrack["index"];
    } else {
        playerlist = arrShuffle(playerlist);
        playingPos = 0;
        //Bring currentTrack to position 0
        for (let i = 0; i < playerlist.length; i++) {
            if (playerlist[i] == currentTrack) {
                [playerlist[0], playerlist[i]] = [playerlist[i], playerlist[0]];
                break;
            }
        }
    }
    shuffle = !shuffle;
    //TODO svg color togglen
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

function audioMuteSwitch() {
    //TODO
}

function updateSongInfo() {
    let songInfo = document.getElementById("song-info");
    songInfo.childNodes[1].innerHTML = currentTrack["title"];
    songInfo.childNodes[3].innerHTML = currentTrack["artist"];
}

function updateSonglist() {
    playerlist = arrClone(songlist);
    //Index songlist
    for (let i = 0; i < playerlist.length; i++) {
        playerlist[i]["index"] = i;
    }
}

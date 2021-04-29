import { crawler } from "./crawler.js";
import { initSonglist, getSonglist } from "./songlist.js";
import { arrSort, arrShuffle } from "./util/object.js";
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
    selectedSong,
    playingPos;

function initPlayer() {
    //init player variables
    player = new Audio();
    playing = false;
    loop = false;
    shuffle = false;
    songlist = updateSonglist();
    selectedSong = songlist[0];
    player.src = selectedSong["url"];
    playingPos = 0;

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
    if (!playing) {
        playing = true;
        player.play();
    }
}

//Set player to pause
function audioPause() {
    if (playing) {
        playing = false;
        player.pause();
    }
}

//Skipping song
function audioSkip() {
    //Skip to the next song if possible else restart songlist and pause
    if (songlist[playingPos + 1] != null) {
        selectedSong = songlist[playingPos++];
        player.src = selectedSong["url"];
        updateSongInfo();
    } else {
        playingPos = 0;
        selectedSong = songlist[playingPos];
        player.src = selectedSong["url"];
        updateSongInfo();
        if (playing) {
            player.pause();
        }
    }
}

//Got to song start or a song back
function audioBack() {
    //Restart song or go a song back
    if (player.currentTime > 3 || playingPos == 0) {
        player.currentTime = 0;
    } else {
        selectedSong = songlist[playingPos--];
        player.src = selectedSong["url"];
        updateSongInfo();
    }
}

//Switches shuffle
function audioShuffle() {
    if (shuffle) {
        songlist = arrSort(songlist, "index", 1);
        playingPos = selectedSong["index"];
    } else {
        songlist = arrShuffle(songlist);
        playingPos = 0;
        //Bring selectedSong to position 0
        for (let i = 0; i < songlist.length; i++) {
            if (songlist[i] == selectedSong) {
                [songlist[0], songlist[i]] = [songlist[i], songlist[0]];
                break;
            }
        }
    }
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
    songInfo.childNodes[1].innerHTML = selectedSong["title"];
    songInfo.childNodes[3].innerHTML = selectedSong["artist"];
}

function updateSonglist() {
    let list = getSonglist();
    //Index songlist
    for (let i = 0; i < list.length; i++) {
        list[i]["index"] = i;
    }
    return list;
}

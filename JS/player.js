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
    currentTrack,
    playingPos;

function initPlayer() {
    //init player variables
    player = new Audio();
    playing = false;
    loop = false;
    shuffle = false;
    updateSonglist();
    currentTrack = songlist[0];
    player.src = currentTrack["url"];
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
    test();
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
        currentTrack = songlist[playingPos++];
        player.src = currentTrack["url"];
        updateSongInfo();
    } else {
        playingPos = 0;
        currentTrack = songlist[playingPos];
        player.src = currentTrack["url"];
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
        currentTrack = songlist[playingPos--];
        player.src = currentTrack["url"];
        updateSongInfo();
    }
}

//Switches shuffle
function audioShuffle() {
    if (shuffle) {
        songlist = arrSort(songlist, "index", 1);
        playingPos = currentTrack["index"];
    } else {
        arrShuffle(songlist);
        playingPos = 0;
        //Bring currentTrack to position 0
        console.log(songlist);
        for (let i = 0; i < songlist.length; i++) {
            if (songlist[i] == currentTrack) {
                [songlist[0], songlist[i]] = [songlist[i], songlist[0]];
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

function updateSongInfo() {
    let songInfo = document.getElementById("song-info");
    songInfo.childNodes[1].innerHTML = currentTrack["title"];
    songInfo.childNodes[3].innerHTML = currentTrack["artist"];
}

function updateSonglist() {
    songlist = getSonglist();
    //Index songlist
    for (let i = 0; i < songlist.length; i++) {
        songlist[i]["index"] = i;
    }
}

function test() {
    let list = getSonglist();
    let test = getSonglist();
    console.log(test);
    arrShuffle(list);
}

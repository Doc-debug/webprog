import { crawler } from "./crawler.js";
import { initSonglist, songlist } from "./songlist.js";
import { arrSort, arrShuffle, arrClone } from "./util/object.js";
("use strict");

/**
 * initializes everything on load
 */
window.onload = async function () {
    let data = await crawler();
    initSonglist();
    initPlayer();
};

/** @type {Audio} an audio element that is playing music*/
let player;
/** @type {Array} a list of all the current songs in the player*/
let playerlist;
/** @type {number} the current position in the playerlist*/
let playingPos;
/** @type {object} the current song object that is playing */
let currentTrack;

/** player control button doms */
let btnPlayPause, btnLoop, btnShuffle, btnSkip, btnBack, btnMute;

/** the svg dom element for play and pause (for switch) */
let svgPlay, svgPause;

/** @type {boolean} player booleans */
let loop, shuffle, playing;

/** player dom elements */
let songSlider, volumeSlider, songInfo;

/**
 * Initialize all default values and set event listener
 */
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
    // init song info space
    songInfo = document.getElementById("song-info");

    //init playPauseImg
    svgPlay = document.getElementById("play-svg");
    svgPause = document.getElementById("pause-svg");

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

/**
 * Switch for play and pause
 */
function switchPlayPause() {
    if (playing) {
        audioPause();
    } else {
        audioPlay();
    }
}

/**
 * Set player to play and switch icon
 */
function audioPlay() {
    playing = true;
    player.play();
    svgPause.setAttribute("class", "");
    svgPlay.setAttribute("class", "invisible");
}

/**
 * Set player to pause and switch icon
 */
function audioPause() {
    playing = false;
    player.pause();
    svgPlay.setAttribute("class", "");
    svgPause.setAttribute("class", "invisible");
}

/**
 * Skip the current playing song
 */
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
        // only pause if loop is disabled
        if (playing && !loop) {
            audioPause();
        }
    }
}

/**
 * Start song at the beginning or repeat the last song
 */
function audioBack() {
    // if song timer is over 3 seconds start song from beginning
    if (player.currentTime > 3) {
        player.currentTime = 0;
    } else {
        // if go to last song or go to the end of the list if at the beginning
        playingPos = playingPos == 0 ? playerlist.length - 1 : --playingPos;
        currentTrack = playerlist[playingPos];
        player.src = currentTrack["url"];
        updateSongInfo();
        audioPlay();
    }
}

/**
 * switch audio to shuffle mode
 */
function audioShuffle() {
    if (shuffle) {
        // bring array back in order
        playerlist = arrSort(playerlist, "index", 1);
        playingPos = currentTrack["index"];
    } else {
        // shuffle array
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

    // set button css styling to active
    if (shuffle) {
        btnShuffle.classList.add("active");
    } else {
        btnShuffle.classList.remove("active");
    }
}

/**
 * Switching loop control
 */
function audioLoop() {
    loop = !loop;
    player.loop = loop;
    // set button css styling to active
    if (loop) {
        btnLoop.classList.add("active");
    } else {
        btnLoop.classList.remove("active");
    }
}

/**
 * Set volume
 * @param {volume} volume from 0.0 to 1.0
 */
function audioVolume(volume) {
    player.volume = volume;
}

/**
 * switches between mute audio and play audio
 */
function audioMuteSwitch() {
    //TODO
}

/**
 * set song title and artist to song info dom
 */
function updateSongInfo() {
    songInfo.childNodes[1].innerHTML = currentTrack["title"];
    songInfo.childNodes[3].innerHTML = currentTrack["artist"];
}

/**
 * update songs from songlist
 */
function updateSonglist() {
    playerlist = arrClone(songlist);
    //Index songlist
    for (let i = 0; i < playerlist.length; i++) {
        playerlist[i]["index"] = i;
    }
}

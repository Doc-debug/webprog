import { songlist } from "./songlist.js";
import { getObj, setObj } from "./util/localstorage.js";
import { arrSort, arrShuffle, arrClone } from "./util/object.js";
("use strict");

/** @type {Audio} an audio element that is playing music*/
let player;

/** player control button doms */
let btnLoop, btnShuffle;

/** the svg dom element for play and pause (for switch) */
let svgPlay, svgPause;

/** player dom elements */
let songSlider, volumeSlider, songInfo;

/**
 * @type {Object} holds all configurations for the player
 * is stored and loaded from local storage
 */
let conf = {
    loop: false,
    loopOne: false,
    shuffle: false,
    playing: false,
    playerlist: [],
    playingPos: 0,
    currentTrack: null,
    progress: 0,
    volume: 0.3,
};

/**
 * Initialize all default values and set event listener
 */
export function initPlayer() {
    // get player data from local storage
    let cache = getObj("playerConf");
    if (cache != null) conf = cache;
    //init player
    player = new Audio();
    updateSonglist();

    // set current track if it hasnt been initialized yet
    if (conf.currentTrack == null) conf.currentTrack = conf.playerlist[0];
    player.src = conf.currentTrack["url"];
    player.currentTime = conf.progress;
    setMetadata(conf.currentTrack);

    // go to next song if the player has ended with the current one
    player.addEventListener("ended", function () {
        audioSkip();
    });

    // control doms
    songInfo = document.getElementById("song-info");
    btnShuffle = document.getElementById("shuffle-control");
    btnLoop = document.getElementById("loop-control");
    svgPlay = document.getElementById("play-svg");
    svgPause = document.getElementById("pause-svg");

    //init songSlider and set gradient for the progress bar color
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

    //init songSlider and set gradient for the progress bar color
    volumeSlider = document.getElementById("volume-control");
    volumeSlider.value = conf.volume * 100;
    volumeSlider.oninput = function () {
        let x = volumeSlider.value;
        var sliderBackground =
            "linear-gradient(90deg, var(--contrast) " +
            x +
            "%, var(--bg-tertionary)" +
            x +
            "%)";
        volumeSlider.style.background = sliderBackground;
        updateConf();
    };
    volumeSlider.addEventListener("mousemove", function () {
        audioVolume(volumeSlider.value / 100);
    });
    audioVolume(conf.volume);

    volumeSlider.oninput();
    updateSongInfo();
    initNavigator();

    // add functions to global scope so buttons with onclick can access it
    window.audioShuffle = audioShuffle;
    window.audioBack = audioBack;
    window.switchPlayPause = switchPlayPause;
    window.audioSkip = audioSkip;
    window.audioLoop = audioLoop;
    window.audioMuteSwitch = audioMuteSwitch;

    // start playing song set in cache
    if (conf.playing) {
        if (confirm("Do you want the browser to continue play your music?")) {
            try {
                audioPlay();
            } catch (error) {
                console.error(error);
                conf.playing = false;
            }
        }
    }
}

/**
 * Switch for play and pause
 */
export function switchPlayPause() {
    if (conf.playing) {
        audioPause();
    } else {
        audioPlay();
    }
}

/**
 * Set player to play and switch icon
 */
export function audioPlay() {
    conf.playing = true;
    player.play();
    // set button styling
    svgPause.setAttribute("class", "");
    svgPlay.setAttribute("class", "invisible");
    updateConf();
}

/**
 * Set player to pause and switch icon
 */
export function audioPause() {
    conf.playing = false;
    player.pause();
    // set button styling
    svgPlay.setAttribute("class", "");
    svgPause.setAttribute("class", "invisible");
    updateConf();
}

/**
 * Skip the current playing song
 */
export function audioSkip() {
    //Skip to the next song if possible else restart songlist and pause
    if (conf.playerlist[conf.playingPos + 1] != null) {
        playSongAt(++conf.playingPos, false);
    } else {
        // only pause if loop is disabled
        playSongAt(0, false, conf.playing && !conf.loop);
    }
}

/**
 * Start song at the beginning or repeat the last song
 */
export function audioBack() {
    // if song timer is over 3 seconds start song from beginning
    if (player.currentTime > 3 || conf.playingPos == 0) {
        player.currentTime = 0;
    } else {
        // else go to last song
        playSongAt(--conf.playingPos, false);
    }
}

/**
 * switch audio to shuffle mode
 */
export function audioShuffle() {
    if (conf.shuffle) {
        // bring array back in order
        conf.playerlist = arrSort(conf.playerlist, "index", 1);
        conf.playingPos = conf.currentTrack["index"];
    } else {
        // shuffle array
        conf.playerlist = arrShuffle(conf.playerlist);
        conf.playingPos = 0;
        //Bring currentTrack to position 0
        for (let i = 0; i < conf.playerlist.length; i++) {
            if (conf.playerlist[i] == conf.currentTrack) {
                [conf.playerlist[0], conf.playerlist[i]] = [
                    conf.playerlist[i],
                    conf.playerlist[0],
                ];
                break;
            }
        }
    }
    conf.shuffle = !conf.shuffle;

    // set button css styling to active
    if (conf.shuffle) {
        btnShuffle.classList.add("active");
    } else {
        btnShuffle.classList.remove("active");
    }
    updateConf();
}

/**
 * Switching loop control
 */
export function audioLoop() {
    conf.loop = !conf.loop;
    player.loop = conf.loop;
    // set button css styling to active
    if (conf.loop) {
        btnLoop.classList.add("active");
    } else {
        btnLoop.classList.remove("active");
    }
    updateConf();
}

/**
 * Set volume
 * @param {volume} volume from 0.0 to 1.0
 */
export function audioVolume(volume) {
    player.volume = volume;
    conf.volume = volume;
}

/**
 * switches between mute audio and play audio
 */
export function audioMuteSwitch() {
    audioVolume(0);
}

/**
 * set song title and artist to song info dom
 */
export function updateSongInfo() {
    songInfo.childNodes[1].innerHTML = conf.currentTrack.title;
    songInfo.childNodes[3].innerHTML = conf.currentTrack.artist;
}

/**
 * update songs from songlist
 */
export function updateSonglist() {
    conf.playerlist = arrClone(songlist);
    //Index songlist
    for (let i = 0; i < conf.playerlist.length; i++) {
        conf.playerlist[i]["index"] = i;
    }
    updateConf();
}

/**
 * takes an index for the songlist and sets that song to the current song and plays it
 * @param {number} i the index of the song in the songlist
 * @param {boolean} if true will fetch all songs from the current songlist
 * @param {boolean} if the song should be played or not
 */
export function playSongAt(i, update = true, play = true) {
    if (update) updateSonglist();
    conf.playingPos = i;
    conf.currentTrack = conf.playerlist[conf.playingPos];
    try {
        player.src = conf.currentTrack["url"];
    } catch (error) {
        console.log(error, "url load");
    }

    try {
        if (play) audioPlay();
    } catch (error) {
        console.log(error, "url load");
    }
    updateSongInfo();
    setMetadata(conf.currentTrack);
    updateConf();
}

/**
 * updates the config in local storage for the player
 */
function updateConf() {
    setObj("playerConf", conf);
}

/**
 * sets all navigator functions like play, pause etc.
 */
function initNavigator() {
    navigator.mediaSession.setActionHandler("play", function () {
        audioPlay();
    });
    navigator.mediaSession.setActionHandler("pause", function () {
        audioPause();
    });
    navigator.mediaSession.setActionHandler("previoustrack", function () {
        audioBack();
    });
    navigator.mediaSession.setActionHandler("nexttrack", function () {
        audioSkip();
    });
}

/**
 * updates all metadata for the browser
 * @param {*} song the song object that contains all metadata
 */
function setMetadata(song) {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: song.album,
            artwork: [],
        });
    }
}

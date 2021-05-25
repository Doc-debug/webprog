import { getObj, setObj } from "./util/localstorage.js";
import { arrSort, arrShuffle, arrClone } from "./util/object.js";
import { secondsToMinutes, prettyTimeString } from "./util/time.js";
import { Songlist } from "./songlistClass.js";
("use strict");

/** @type {Audio} an audio element that is playing music*/
let player;

/** @type {Songlist} class that holds all songs in the table */
let songlist;

/** @type {Songlist} class that holds all current displayed songs */
let currentSongList;

/** player control button doms */
let btnLoop, btnShuffle;

/** the svg dom element for play and pause (for switch) */
let svgPlay, svgPause;

/** player dom elements */
let songSlider, volumeSlider, songInfo, btnMute;

/**
 * @type {Object} holds all configurations for the player
 * is stored and loaded from local storage
 */
export let conf = {
    loop: false,
    loopOne: false,
    shuffle: false,
    playing: false,
    playerlist: [],
    playingPos: 0,
    currentTrack: null,
    time: 0,
    volume: 0.3,
    volumeUnmute: 0.3,
};

/**
 * Initialize all default values and set event listener
 * @param {Songlist} songlistObj the table in the background where songs might be copied from
 */
export function initPlayer(songlistObj) {
    // init the current songlist table
    currentSongList = new Songlist("player-playlist-table", false, true);
    songlist = songlistObj;
    // get player data from local storage
    let cache = getObj("playerConf");
    if (cache != null) conf = cache;
    //init player
    player = new Audio();
    updateSonglist();
    initDoms();

    // set current track if it hasnt been initialized yet
    if (conf.currentTrack == null && conf.playerlist.length > 0)
        conf.currentTrack = conf.playerlist[0];

    if (conf.currentTrack) {
        player.src = conf.currentTrack["url"];
        player.currentTime = conf.time;
    }
    // reset playing since google blocks attempts to autoplay music
    conf.playing = false;

    //init songSlider and set gradient for the progress bar color
    songSlider = document.getElementById("song-slider");
    songSlider.oninput = function () {
        player.currentTime = (songSlider.value * player.duration) / 100;
        updateSongProgress();
    };
    player.addEventListener("timeupdate", updateSongProgress);

    //init songSlider and set gradient for the progress bar color
    volumeSlider = document.getElementById("volume-control");
    volumeSlider.value = conf.volume * 100;
    volumeSlider.oninput = function () {
        let x = volumeSlider.value;
        x = isNaN(x) ? 0 : x;
        let sliderBackground =
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
    initNavigator();
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
    // visualizer has to be init here cause chrome needs it to be playing when creating the analyzer ctx
    initSongVisualizer();
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
    if (conf.volume != 0) {
        conf.volumeUnmute = conf.volume;
        audioVolume(0);
        btnMute.classList.add("op-d");
    } else {
        audioVolume(conf.volumeUnmute);
        btnMute.classList.remove("op-d");
    }
}

/**
 * set song title and artist to song info dom
 */
export function updateSongInfo() {
    songInfo.childNodes[1].innerHTML = conf.currentTrack.title;
    songInfo.childNodes[3].innerHTML = conf.currentTrack.artist;
    songSlider.parentElement.children[2].innerHTML = prettyTimeString(
        secondsToMinutes(player.duration)
    );
}

/**
 * update songs from songlist
 */
export function updateSonglist() {
    conf.playerlist = arrClone(songlist.songlist);
    //Index songlist
    for (let i = 0; i < conf.playerlist.length; i++) {
        conf.playerlist[i]["index"] = i;
    }
    updateConf();
}

/**
 * Updates the sonng progess slider and the current time
 */
function updateSongProgress() {
    let songLength = player.duration;
    conf.time = player.currentTime;

    let percProgress = (conf.time / songLength) * 100;
    songSlider.value = percProgress;
    percProgress = isNaN(percProgress) ? 0 : percProgress;

    let sliderBackground =
        "linear-gradient(90deg, var(--contrast) " +
        percProgress +
        "%, var(--bg-tertionary)" +
        percProgress +
        "%)";
    songSlider.style.background = sliderBackground;
    let minSec = secondsToMinutes(conf.time);
    songSlider.parentElement.children[1].innerHTML = prettyTimeString(minSec);
    updateConf();
}

/**
 * takes an index for the songlist and sets that song to the current song and plays it
 * @param {number} i the index of the song in the songlist
 * @param {boolean} update if true will fetch all songs from the current songlist
 * @param {boolean} play if the song should be played or not
 * @param {boolean} localIndex if the given index should be added to the current playing song or if its absolute from the whole list
 */
export function playSongAt(i, update = true, play = true, localIndex = false) {
    if (update) updateSonglist();
    conf.playingPos = localIndex ? conf.playingPos + i : i;
    conf.currentTrack = conf.playerlist[conf.playingPos];

    player.src = conf.currentTrack["url"];

    if (play) audioPlay();
    updateConf();
    updatePlayerList();
}

/**
 * inserts a song in the next position of the current played songs list
 * @param {songObj} song the song object that should be inserted
 */
export function playNext(song) {
    conf.playerlist.splice(conf.playingPos + 1, 0, song);
    updatePlayerList();
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
 * gets all the dom elements and creates eventlistener
 */
function initDoms() {
    // control doms
    songInfo = document.getElementById("song-info");
    svgPlay = document.getElementById("play-svg");
    svgPause = document.getElementById("pause-svg");
    btnShuffle = document.getElementById("shuffle-control");
    btnLoop = document.getElementById("loop-control");
    btnMute = document.getElementById("mute-control");
    let btnPlay = document.getElementById("play-control");
    let btnBack = document.getElementById("back-control");
    let btnSkip = document.getElementById("skip-control");
    let expand = document.getElementById("expand-player-list");

    btnShuffle.addEventListener("click", () => {
        audioShuffle();
    });
    btnLoop.addEventListener("click", () => {
        audioLoop();
    });
    btnPlay.addEventListener("click", () => {
        switchPlayPause();
    });
    btnBack.addEventListener("click", () => {
        audioBack();
    });
    btnSkip.addEventListener("click", () => {
        audioSkip();
    });
    btnMute.addEventListener("click", () => {
        audioMuteSwitch();
    });
    expand.addEventListener("click", () => {
        togglePList();
    });
    songInfo.addEventListener("click", () => {
        togglePList();
    });

    // go to next song if the player has ended with the current one
    player.addEventListener("ended", function () {
        audioSkip();
    });
    // skip song if source not supported
    player.addEventListener("error", function (e) {
        audioSkip();
    });
    player.addEventListener("loadedmetadata", function () {
        updateSongInfo();
        setMetadata(conf.currentTrack);
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

let active = false;
/**
 * toggle current songlist
 */
function togglePList() {
    let playerDOM = document.getElementById("player");
    let arrow = document.getElementById("expand-player-list");
    let container = document.getElementById("player-playlist");
    if (active) {
        playerDOM.classList.remove("songlist-active");
        arrow.classList.remove("rotate");
        setTimeout(() => {
            container.style.display = "none";
        }, 500);
    } else {
        playerDOM.classList.add("songlist-active");
        arrow.classList.add("rotate");
        container.style.display = "block";
        updatePlayerList();
    }

    active = !active;
}

/**
 * updates the songs in the current "played songs" list
 */
function updatePlayerList() {
    currentSongList.fill(conf.playerlist.slice(conf.playingPos));
}

let ctx;
/**
 * creates an audiocontext and analyzer to visualize the sound data in a canvas
 * @returns if song visualizer has already been created
 */
function initSongVisualizer() {
    // prevent visualizer from being created multiple times
    if (ctx != undefined) return;
    ctx = new AudioContext();
    let audioSrc = ctx.createMediaElementSource(player);
    let analyser = ctx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    // define how many bar bars there are
    let bufferSize = 256;
    analyser.fftSize = bufferSize;
    let frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // get canvas element
    let canvas = document.getElementById("visualizer");
    let canvasCtx = canvas.getContext("2d");

    // set fix values for canvas size since it might otherwise be initialized wrong
    canvas.width = window.innerWidth >= 1000 ? 1000 : window.innerWidth;
    canvas.height = 200;

    let width = canvas.width;
    let height = canvas.height;

    // calculate barchart bar dimensions
    var barWidth = (width / bufferSize) * 2.5;
    var barHeight;
    var x = 0;
    /**
     * takes the frequency data from the analyser object and visualizes it as a bar chart in the canvas
     */
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        x = 0;
        // update data in frequencyData
        analyser.getByteFrequencyData(frequencyData);

        // render frame based on values in frequencyData
        canvasCtx.clearRect(0, 0, width, height);

        // get contrast color variable from css
        canvasCtx.fillStyle = getComputedStyle(
            document.documentElement
        ).getPropertyValue("--contrast");
        for (var i = 0; i < bufferSize; i++) {
            // set the position and height for each bar
            barHeight = frequencyData[i];
            canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    renderFrame();
}

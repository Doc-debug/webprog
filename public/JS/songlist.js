import { pad } from "./util/convert.js";
import { arrSort } from "./util/object.js";
import { find } from "./phpCrawler.js";
import { initctxm } from "./util/ctxm.js";
import { ctxmPlaylists } from "./playlistMod.js";
import { playSongAt } from "./playerMod.js";
("use strict");

/**
 * @type {Array} Holds all songs from the list
 */
export var songlist = [];
/**
 * @type {string} the id of the table. This can be changed on initialization if it differes from the original one "song-table-body"
 */
let listID = "song-table-body";
/**
 * @type {string} the previously used sorting tag
 */
let lastSort = "title";
/**
 * @type {number} the previously used sorting direction
 */
let lastSortDir = -1;

/**
 * initializes the songlist by filling the table with all songs and adding module functions to the global scope
 * @param {string} listID the id string of the list
 */
export async function initSonglist(listID = "song-table-body") {
    fillSongList(find(""));
    window.searchbarUpdate = searchbarUpdate; // add to global scope for onkeyup
    window.sortTag = sortTag; // add to global scope for onclick
}

/**
 * fills the song table with a given song object array
 * @param {array} songs the songs that will be inserted into the table
 * @param {string} sortingTag the tag by wich the list will be sorted (title, artist, album, ... see crawler)
 * @param {number} sortDir the sorting direction. Should be either 1 or -1
 * @param {boolean} overwriteSongList if the songlist should be updated when the function is called
 */
export async function fillSongList(
    songs = songlist,
    sortingTag = null,
    sortDir = 1,
    overwriteSongList = true
) {
    if (sortingTag != null) songs = arrSort(songs, sortingTag, sortDir);
    if (overwriteSongList) songlist = songs;

    // get table element
    let list = document.getElementById(listID);
    list.innerHTML = "";
    // for each object in array create a row and cells with song details
    songs.forEach((song, index) => {
        let row = list.insertRow();
        let options = row.insertCell(0);
        let link = document.createElement("a");
        link.innerHTML = "...";
        link.addEventListener("click", function () {
            // calls context menu when clicked
            ctxmSonglist(link, song.title);
        });
        options.appendChild(link);
        let length = row.insertCell(0);
        length.innerHTML =
            pad(Math.floor(parseInt(song.length) / 60)) +
            ":" +
            pad(parseInt(song.length) % 60);
        let folder = row.insertCell(0);
        folder.innerHTML = song.folder;
        let album = row.insertCell(0);
        album.innerHTML = song.album;
        let artist = row.insertCell(0);
        artist.innerHTML = song.artist;
        let title = row.insertCell(0);
        title.innerHTML = song.title;
        title.addEventListener("click", function () {
            // calls context menu when clicked
            playSongAt(index);
        });
    });
}

/**
 * sorts and updates the songtable / songlist
 * @param {string} tag the tag by which the song list should be sorted
 */
function sortTag(tag) {
    // if sorting tag is the same as last time change direction
    let sortDir = lastSort == tag ? lastSortDir * -1 : 1;
    lastSortDir = sortDir;
    lastSort = tag;
    fillSongList(songlist, tag, sortDir);
}

/**
 * gets data from searchbar input and updates the song list with it
 */
function searchbarUpdate() {
    let input = document.getElementById("searchbar").value;
    let tag = document.getElementById("searchtag").value;

    fillSongList(find(input, tag, songlist), null, 1, false);
}

/**
 * opens the context menu to offer options (add to playlist, play song)
 * @param {dom} ele the clicked object to spawn context menu at the same position
 * @param {string} song the song title
 */
function ctxmSonglist(ele, song) {
    // use default context menu initializer
    let container = initctxm(ele);
    // create first ctxm option add playlist
    let addToPlaylist = document.createElement("a");
    addToPlaylist.innerHTML = "add to playlist";
    addToPlaylist.addEventListener("click", function () {
        ctxmPlaylists(ele, song);
    });
    container.appendChild(addToPlaylist);

    // create second ctxm option play song
    let play = document.createElement("a");
    play.innerHTML = "play song";
    container.appendChild(play);
}

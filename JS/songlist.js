import { pad } from "./util/convert.js";
import { arrShuffle, arrSort } from "./util/object.js";
import { crawler, tree, find } from "./crawler.js";
("use strict");

export async function initSonglist() {
    fillSongList(find(""));
    window.searchbarUpdate = searchbarUpdate; // add to global scope for onkeyup
    window.sortTag = sortTag; // add to global scope for onclick
}

export var songlist = [];
// fills song list with given object array
async function fillSongList(songs = songlist, sortingTag = null, sortDir = 1) {
    if (sortingTag != null) songs = arrSort(songs, sortingTag, sortDir);
    songlist = songs;

    // get dom element
    let list = document.getElementById("song-table-body");
    list.innerHTML = "";
    // for each object in array create a row and cells with song details
    songs.forEach((song) => {
        let row = list.insertRow();
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
    });
}

let lastSort = "title";
let lastSortDir = -1;
// takes a sorting tag and updates the map with it
function sortTag(tag) {
    // if sorting tag is the same as last time change direction
    let sortDir = lastSort == tag ? lastSortDir * -1 : 1;
    lastSortDir = sortDir;
    lastSort = tag;
    fillSongList(songlist, tag, sortDir);
}
// gets data from searchbar input and updates the song list with it
function searchbarUpdate() {
    let input = document.getElementById("searchbar").value;
    fillSongList(find(input));
}

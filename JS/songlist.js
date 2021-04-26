import { pad } from "./util/convert.js";
import { arrSort } from "./util/object.js";
import { crawler, tree, find } from "./crawler.js";
("use strict");

window.onload = async function () {
    let data = await crawler();
    fillSongList(find(""));
};

export let lastSongArr = [];
// fills song list with given object array
async function fillSongList(songs, sortingTag = "title", sortDir = 1) {
    songs = arrSort(songs, sortingTag, sortDir);
    lastSongArr = songs;
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
        let url = row.insertCell(0);
        url.innerHTML = song.url;
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
    fillSongList(lastSongArr, tag, sortDir);
}
// gets data from searchbar input and updates the song list with it
function searchbarUpdate() {
    let input = document.getElementById("searchbar").value;
    fillSongList(find(input));
}
window.searchbarUpdate = searchbarUpdate; // add to global scope for onkeyup
window.sortTag = sortTag; // add to global scope for onclick

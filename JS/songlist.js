import { pad } from "./util/convert.js";
import { arrShuffle, arrSort } from "./util/object.js";
import { crawler, tree, find } from "./crawler.js";
import { initctxm } from "./util/ctxm.js";
import { ctxmPlaylists } from "./playlistMod.js";
("use strict");

let listID = "song-table-body";
export async function initSonglist(listID = "song-table-body") {
    fillSongList(find(""));
    window.searchbarUpdate = searchbarUpdate; // add to global scope for onkeyup
    window.sortTag = sortTag; // add to global scope for onclick
}

export var songlist = [];
// fills song list with given object array
export async function fillSongList(
    songs = songlist,
    sortingTag = null,
    sortDir = 1,
    overwriteSongList = true
) {
    if (sortingTag != null) songs = arrSort(songs, sortingTag, sortDir);
    if (overwriteSongList) songlist = songs;

    // get dom element
    let list = document.getElementById(listID);
    list.innerHTML = "";
    // for each object in array create a row and cells with song details
    songs.forEach((song) => {
        let row = list.insertRow();
        let options = row.insertCell(0);
        let link = document.createElement("a");
        link.innerHTML = "...";
        link.addEventListener("click", function () {
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
    let tag = document.getElementById("searchtag").value;

    fillSongList(find(input, tag, songlist), null, 1, false);
}

function ctxmSonglist(ele, song) {
    let container = initctxm(ele);
    let addToPlaylist = document.createElement("a");
    addToPlaylist.innerHTML = "add to playlist";
    addToPlaylist.addEventListener("click", function () {
        ctxmPlaylists(ele, song);
    });
    container.appendChild(addToPlaylist);

    let play = document.createElement("a");
    play.innerHTML = "play song";
    container.appendChild(play);
}

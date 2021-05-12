import { crawler } from "./crawler.js";
import { initSonglist, fillSongList } from "./songlist.js";
import {
    playlists,
    initPlaylist,
    createPlaylist,
    addSong,
} from "./playlistMod.js";
import { initPlayer } from "./playerMod.js";
("use strict");

window.onload = async function () {
    // add functions to global scope so buttons with onclick can access it
    window.promptCreatePlaylist = promptCreatePlaylist;
    window.loadPlaylist = loadPlaylist;
    window.addSong = addSong;

    // init crawler
    let data = await crawler();

    // init necessary modules
    initPlaylist();
    updatePlayslistList();
    initSonglist("playlist-song-table");
    // load first playlist as default
    if (playlists.length != 0) loadPlaylist(0);

    // load player
    initPlayer();
};
/**
 * updates the playlist list on the website
 */
function updatePlayslistList() {
    let list = document.getElementById("playlist-list-container");
    // clear dom
    list.innerHTML = "";
    // for every playlist in playlists create a element and add to container
    for (let i = 0; i < playlists.length; i++) {
        const element = playlists[i];
        let item = document.createElement("a");
        item.setAttribute("onclick", "loadPlaylist(" + i + ")");
        item.innerHTML = element.name;
        list.appendChild(item);
    }
}
/**
 * creates a prompt to ask for the creation of a new playlist
 */
function promptCreatePlaylist() {
    let name = prompt("What name should your new playlist have?");
    // return if user pressed cancel
    if (name == null) return;
    // if no name was given set name to "new Playlist"
    else if (name == "") name = "new Playlist";
    createPlaylist(name);
    updatePlayslistList();
}

/**
 * loads a given playlist into the table
 * @param {number} index the index of the playlist in playlists array
 */
function loadPlaylist(index) {
    let data = playlists[index];
    fillSongList(data.songs);
}

import { crawler, tree } from "./crawler.js";
import { initSonglist, fillSongList } from "./songlist.js";
import {
    playlists,
    initPlaylist,
    createPlaylist,
    addSong,
} from "./playlistMod.js";
("use strict");

window.onload = async function () {
    let data = await crawler();
    initPlaylist();
    updatePlayslistList();

    initSonglist("playlist-song-table");

    window.promptCreatePlaylist = promptCreatePlaylist;
    window.loadPlaylist = loadPlaylist;
    window.addSong = addSong;
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

import { crawler, tree } from "./crawler.js";
import { initSonglist, fillSongList } from "./songlist.js";
import {
    playlists,
    initPlaylist,
    createPlaylist,
    updatePlaylistStorage,
    getPlaylistStorage,
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
function updatePlayslistList() {
    let list = document.getElementById("playlist-list-container");
    list.innerHTML = "";
    console.log(playlists);
    for (let i = 0; i < playlists.length; i++) {
        const element = playlists[i];
        let item = document.createElement("a");
        item.setAttribute("onclick", "loadPlaylist(" + i + ")");
        item.innerHTML = element.name;
        list.appendChild(item);
    }
}
function promptCreatePlaylist() {
    let name = prompt("What name should your new playlist have?");
    if (name == null) return;
    else if (name == "") name = "new Playlist";
    createPlaylist(name);
    updatePlayslistList();
}

function loadPlaylist(index) {
    let data = playlists[index];
    fillSongList(data.songs);
    console.log("loaded", data);
}

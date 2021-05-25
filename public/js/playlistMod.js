import { getObj, setObj } from "./util/localstorage.js";
import { initctxm } from "./util/ctxm.js";
import { splitArr } from "./util/object.js";
import { find } from "./crawlerPHP.js";
("use strict");

/**
 * holds all playlists in format {name: "name", songs: []}
 */
export let playlists = [];
/**
 * holds all songs in their respective folder in format {name: "name", songs: []}
 */
export let folderPlaylists = [];
/**
 * initializes the playlist by copying it from the local storage or creating a new one if it doesnt exist yet
 * also creates the folder playlists
 */
export function initPlaylist() {
    playlists = getPlaylistStorage();
    if (playlists == null) {
        playlists = [];
        updatePlaylistStorage();
    }
    folderPlaylists = splitArr(find(""), "folder");
}
/**
 * Adds a playlist to the playlist list and updates the localstorage
 * @param {string} name the name of the playlist
 * @param {array} songlist an optional array of songs that should be inserted. Will be empty otherwise
 */
export function createPlaylist(name, songlist = []) {
    let playlist = {
        name: name,
        songs: songlist,
    };
    playlists.push(playlist);
    updatePlaylistStorage();
}
/**
 * deletes a playlist at a given index
 * @param {number} index the index of the playlist item in "playlists" array
 */
export function deletePlaylist(index) {
    if (index > -1) {
        playlists.splice(index, 1);
        updatePlaylistStorage();
    }
}
/**
 * renames a playlist at a given position with a given name
 * @param {number} index the index of the playlist item in the playlists array
 * @param {string} newName the new name for the playlist
 */
export function renamePlaylist(index, newName) {
    if (index > -1) {
        playlists[index].name = newName;
        updatePlaylistStorage();
    }
}
/**
 * updates the playlist in the local storage
 */
export function updatePlaylistStorage() {
    setObj("playlists", playlists);
}
/**
 * uses the local storage and getobj to get the playlist array
 * @returns the playlists array
 */
export function getPlaylistStorage() {
    return getObj("playlists");
}
/**
 * adds a song to the playlists array
 * @param {int} playlistIndex the playlist index in the playlists array
 * @param {object} song a song object from the crawler
 */
export function addSong(playlistIndex, song) {
    playlists[playlistIndex].songs.push(song);
    updatePlaylistStorage();
}
/**
 * Opens a context menu that can be used to add a song to a playlist
 * @param {dom} ele the clicked object to spawn context menu at the same position
 * @param {string} song the song title that should be added to the playlist
 */
export function ctxmPlaylists(ele, song) {
    // if playlists is empty try to get it from local storage
    if (playlists.length == 0) initPlaylist();
    // if still empty create empty ctxm body
    let container = initctxm(ele);
    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];
        let dom = document.createElement("a");
        dom.innerHTML = playlist.name;
        dom.addEventListener("click", function () {
            addSong(i, song);
            container.style.display = "none";
        });
        container.appendChild(dom);
    }
    // button to add a new playlist
    let dom = document.createElement("a");
    dom.classList.add("op-m");
    dom.innerHTML = "new playlist +";
    dom.addEventListener("click", function () {
        let name = prompt("What name should your new playlist have?");
        // return if user pressed cancel
        if (name == null) return;
        // if no name was given set name to "new Playlist"
        else if (name == "") name = "new Playlist";
        createPlaylist(name, find(song));
    });
    container.appendChild(dom);
}

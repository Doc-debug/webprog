import { getObj, setObj } from "./util/localstorage.js";
import { initctxm } from "./util/ctxm.js";
import { find } from "./crawler.js";

/**
 * holds all playlists in format {name: "name", songs: []}
 */
export let playlists = [];
/**
 * initializes the playlist by copying it from the local storage or creating a new one if it doesnt exist yet
 */
export function initPlaylist() {
    playlists = getPlaylistStorage();
    if (playlists == null) {
        playlists = [];
        updatePlaylistStorage();
    }
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
    if (playlists.length == 0) initPlaylist();
    let container = initctxm(ele);
    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];
        let dom = document.createElement("a");
        dom.innerHTML = playlist.name;
        dom.addEventListener("click", function () {
            let songs = find(song);
            if (songs.length == 1) addSong(i, songs[0]);
            container.style.display = "none";
        });
        container.appendChild(dom);
    }
}

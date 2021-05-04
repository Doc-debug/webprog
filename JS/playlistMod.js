import { getObj, setObj } from "./util/localstorage.js";
import { initctxm } from "./util/ctxm.js";
import { find } from "./crawler.js";

export let playlists = [];
export function initPlaylist() {
    playlists = getPlaylistStorage();
    if (playlists == null) {
        playlists = [];
        updatePlaylistStorage();
    }
}
export function createPlaylist(name, songlist = []) {
    let playlist = {
        name: name,
        songs: songlist,
    };
    playlists.push(playlist);
    updatePlaylistStorage();
}
export function updatePlaylistStorage() {
    setObj("playlists", playlists);
}
export function getPlaylistStorage() {
    return getObj("playlists");
}
export function addSong(playlistIndex, song) {
    playlists[playlistIndex].songs.push(song);
    updatePlaylistStorage();
}

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

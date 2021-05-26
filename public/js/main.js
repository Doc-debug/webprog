import { crawler, find } from "./crawlerPHP.js";
import { pageLoader, pageLoaderClose } from "./util/loader.js";
import { Songlist } from "./songlistClass.js";
import {
    playlists,
    folderPlaylists,
    initPlaylist,
    createPlaylist,
    addSong,
    deletePlaylist,
    renamePlaylist,
} from "./playlist.js";
import { initPlayer } from "./musicplayer.js";
("use strict");

let songlist;

/**
 * the index of the current playlist
 */
let currentPlaylist = null;

window.addEventListener("load", async function () {
    // add functions to global scope so buttons with onclick can access it
    window.loadFolder = loadFolder;
    window.addSong = addSong;

    // init crawler and loader while crawler is working
    pageLoader();
    await crawler();
    pageLoaderClose();

    // init necessary modules
    initPlaylist();
    updatePlayslistList();
    songlist = new Songlist("song-table");

    // load eventlisteners
    initEventListener();

    loadPlaylist(-1);
    // load first playlist as default

    // load player
    initPlayer(songlist);
});
/**
 * updates the playlist list on the website
 */
function updatePlayslistList(playlistArr = playlists, funct = loadPlaylist) {
    let list = document.getElementById("playlist-list-container");
    // clear dom
    list.innerHTML = "";
    // for every playlist in playlists create a element and add to container
    for (let i = 0; i < playlistArr.length; i++) {
        const element = playlistArr[i];
        let item = document.createElement("a");
        item.addEventListener("click", () => {
            funct(i);
        });
        item.innerHTML = element.name;
        list.appendChild(item);
    }
}

/**
 * updates the playlist list with folder names on the website
 */
function folderPlaylistList() {
    updatePlayslistList(folderPlaylists, loadFolder);
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
 * @param {Array} an array of playlist arrays
 */
function loadPlaylist(index) {
    if (index == -1) {
        songlist.fill(find(""));
        songlist.setListTitle("All songs");
        togglePlaylistOptions(false);
        return;
    }
    let data = playlists[index];
    songlist.fill(data.songs);
    songlist.setListTitle(data.name);
    currentPlaylist = index;
    togglePlaylistOptions(true);
}
/**
 * loads a given folder into the table
 * @param {number} index the index of the playlist in playlists array
 * @param {Array} an array of playlist arrays
 */
function loadFolder(index) {
    if (index == -1) {
        songlist.fill(find(""));
        return;
    }
    let data = folderPlaylists[index];
    songlist.fill(data.songs);
    songlist.setListTitle(data.name);
    currentPlaylist = null;
    togglePlaylistOptions(false);
}

function togglePlaylistOptions(on) {
    let options = document.getElementById("playlist-options");
    if (on) {
        options.style.display = "";
    } else {
        options.style.display = "none";
    }
}

/**
 * initializes all event listener
 */
function initEventListener() {
    let loadAllSongs = document.getElementById("load-all-songs");
    let selectPlaylistsBtn = document.getElementById("select-playlists-btn");
    let selectFoldersBtn = document.getElementById("select-folders-btn");
    let addPlaylist = document.getElementById("addplaylist");
    let searchbar = document.getElementById("searchbar");
    let searchtag = document.getElementById("searchtag");
    let renamePLBtn = document.getElementById("playlist-option-rename");
    let deletePLBtn = document.getElementById("playlist-option-delete");

    loadAllSongs.addEventListener("click", () => {
        loadPlaylist(-1);
    });
    selectPlaylistsBtn.addEventListener("click", () => {
        updatePlayslistList();
        selectPlaylistsBtn.classList.add("highlight");
        selectFoldersBtn.classList.remove("highlight");
    });
    selectFoldersBtn.addEventListener("click", () => {
        folderPlaylistList();
        selectFoldersBtn.classList.add("highlight");
        selectPlaylistsBtn.classList.remove("highlight");
    });
    addPlaylist.addEventListener("click", () => {
        promptCreatePlaylist();
    });

    searchbar.addEventListener("keyup", function () {
        songlist.searchbarUpdate();
    });
    searchtag.addEventListener("change", function () {
        songlist.searchbarUpdate();
    });
    renamePLBtn.addEventListener("click", () => {
        if (currentPlaylist != null) {
            let newName = prompt("How do you want to name this playlist?");
            if (newName != null && newName != "") {
                renamePlaylist(currentPlaylist, newName);
                updatePlayslistList();
                songlist.setListTitle(newName);
            }
        }
    });
    deletePLBtn.addEventListener("click", () => {
        if (currentPlaylist != null) {
            let confirmation = confirm(
                "Are you sure you want to permanently delete this playlist?"
            );
            if (confirmation) {
                deletePlaylist(currentPlaylist);
                updatePlayslistList();
                loadPlaylist(-1);
            }
        }
    });
}

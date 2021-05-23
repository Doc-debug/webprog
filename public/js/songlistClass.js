import { pad } from "./util/convert.js";
import { arrSort } from "./util/object.js";
import { find } from "./crawlerPHP.js";
import { initctxm } from "./util/ctxm.js";
import { ctxmPlaylists } from "./playlistMod.js";
import { playSongAt, playNext } from "./playerMod.js";
("use strict");

export class Songlist {
    constructor(listID, sortable = true, local = false) {
        /**
         * @type {Array} Holds all songs from the list
         */
        this.songlist = [];
        /**
         * @type {Array} Holds all songs from the list if the searchbar is in use
         */
        this.tempSonglist = [];
        /**
         * @type {string} the id of the table. This can be changed on initialization if it differes from the original one "song-table-body"
         */
        this.listID = listID;
        /**
         * @type {string} the previously used sorting tag
         */
        this.lastSort = "title";
        /**
         * @type {number} the previously used sorting direction
         */
        this.lastSortDir = -1;
        /**
         * @type {boolean} if items in the list should be treated as absolute or local
         * (the current songlist eg only shows the current song and all following. here we select songs with a local index)
         */
        this.local = local;
        /**
         * @type {boolean} if the items in the table should be sortable
         */
        this.sortable = sortable;

        this.table = document.getElementById(this.listID);
        this.table.innerHTML = "";
        this.thead = document.createElement("thead");
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
        this.createTableHead();
    }

    createTableHead() {
        let row = document.createElement("tr");
        let that = this;
        let cols = [
            { name: "Title", sort: "title" },
            { name: "Artist", sort: "artist" },
            { name: "Album", sort: "album" },
            { name: "Folder", sort: "folder" },
            { name: "Length", sort: "length" },
        ];
        for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            let data = document.createElement("th");
            data.innerHTML = col.name;
            if (this.sortable)
                data.addEventListener("mousedown", function () {
                    that.sortTag(col.sort);
                });
            row.appendChild(data);
        }
        this.thead.innerHTML = "";
        this.thead.appendChild(row);
    }

    /**
     * fills the song table with a given song object array
     * @param {array} songs the songs that will be inserted into the table
     * @param {string} sortingTag the tag by wich the list will be sorted (title, artist, album, ... see crawler)
     * @param {number} sortDir the sorting direction. Should be either 1 or -1
     * @param {boolean} overwriteSongList if the songlist should be updated when the function is called
     */
    fill(songs = songlist, sortingTag = null, sortDir = 1, updateTemp = true) {
        let that = this;
        if (sortingTag != null) songs = arrSort(songs, sortingTag, sortDir);
        this.songlist = songs;
        if (updateTemp) this.tempSonglist = this.songlist;

        // get table element
        this.tbody.innerHTML = "";
        // for each object in array create a row and cells with song details
        songs.forEach((song, index) => {
            let row = this.tbody.insertRow();
            let options = row.insertCell(0);
            let link = document.createElement("a");
            link.innerHTML = "...";
            link.addEventListener("click", function () {
                // calls context menu when clicked
                that.ctxmSonglist(link, song);
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
            let localInex = this.local;
            title.addEventListener("click", function () {
                // calls context menu when clicked
                playSongAt(index, true, true, localInex);
            });
        });
    }

    /**
     * sorts and updates the songtable / songlist
     * @param {string} tag the tag by which the song list should be sorted
     */
    sortTag(tag) {
        // if sorting tag is the same as last time change direction
        let sortDir = this.lastSort == tag ? this.lastSortDir * -1 : 1;
        this.lastSortDir = sortDir;
        this.lastSort = tag;
        this.fill(this.songlist, tag, sortDir);
    }

    /**
     * gets data from searchbar input and updates the song list with it
     */
    searchbarUpdate() {
        let input = document.getElementById("searchbar").value;
        let tag = document.getElementById("searchtag").value;

        this.fill(find(input, tag, this.tempSonglist), null, 1, false);
    }

    /**
     * opens the context menu to offer options (add to playlist, play song)
     * @param {dom} ele the clicked object to spawn context menu at the same position
     * @param {string} song the song title
     */
    ctxmSonglist(ele, song) {
        // use default context menu initializer
        let container = initctxm(ele);
        // create first ctxm option add playlist
        let addToPlaylist = document.createElement("a");
        addToPlaylist.innerHTML = "add to playlist";
        addToPlaylist.addEventListener("click", function () {
            ctxmPlaylists(ele, song);
        });
        container.appendChild(addToPlaylist);

        // create second ctxm option play song
        let playNextBtn = document.createElement("a");
        playNextBtn.innerHTML = "play next";
        playNextBtn.addEventListener("click", function () {
            playNext(song);
            container.style.display = "none";
        });
        container.appendChild(playNextBtn);
    }
}

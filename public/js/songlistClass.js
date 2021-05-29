import { pad } from "./util/convert.js";
import { arrSort, isEmpty } from "./util/object.js";
import { find } from "./crawlerMain.js";
import { initctxm, closectxm } from "./util/ctxm.js";
import { ctxmPlaylists } from "./playlist.js";
import { playSongAt, playNext } from "./musicplayer.js";
import { hasClass } from "./util/css.js";
("use strict");

export class Songlist {
    constructor(listID, sortable = true, local = false, selectable = true) {
        /**
         * @type {Array} Holds all songs from the list
         */
        this.songlist = [];
        /**
         * @type {Array} Holds all songs from the list if the searchbar is in use
         */
        this.tempSonglist = [];
        /**
         * @type {Array} a list with all currently selected titles
         */
        this.selectList = {};
        /**
         * @type {number} the index of the last selected row
         */
        this.lastSelectIndex = null;
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
        /**
         * @type {boolean} if row items are selectable
         */
        this.selectable = selectable;

        this.table = document.getElementById(this.listID);
        this.table.innerHTML = "";
        this.thead = document.createElement("thead");
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
        this.createTableHead();

        // get current object to pass instance to eventlistener
        let that = this;
        // when clicking somewhere except table items itself or the "add selected button" deselect everything
        document.addEventListener("mousedown", function (e) {
            if (e.target.id == "table-container") {
                that.unselectAll();
                that.updateAddSelectBtn();
            }
        });

        // init the eventlistener for the "add selected songs to playlist" button
        this.addSelectedBtn = document.getElementById("table-add-selected");
        this.addSelectedBtn.addEventListener("mousedown", function (e) {
            e.stopPropagation();
            e.preventDefault();
            // convert the selectList into a useable array with only songs
            let songs = [];

            for (const id in that.selectList) {
                if (Object.hasOwnProperty.call(that.selectList, id)) {
                    const song = that.selectList[id].song;
                    songs.push(song);
                }
            }
            // call context menu
            ctxmPlaylists(this, songs);
        });
    }

    /**
     * creates the table header with sort functionality
     */
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
            if (this.selectable) {
                row.addEventListener("click", function (e) {
                    if (
                        hasClass(e.target, "song-list-title") ||
                        hasClass(e.target, "song-list-link")
                    ) {
                        that.unselectAll();
                    } else {
                        that.toggleActive(e, this, song, index);
                    }
                });
            }
            let options = row.insertCell(0);
            let link = document.createElement("a");
            link.classList.add("song-list-link");
            link.innerHTML = "...";
            link.addEventListener("click", function () {
                // calls context menu when clicked
                that.ctxmSonglist(link, song);
            });
            options.appendChild(link);
            let length = row.insertCell(0);
            length.classList.add("song-list-length");
            length.innerHTML =
                pad(Math.floor(parseInt(song.length) / 60)) +
                ":" +
                pad(parseInt(song.length) % 60);
            let folder = row.insertCell(0);
            folder.innerHTML = song.folder;
            folder.classList.add("song-list-folder");
            let album = row.insertCell(0);
            album.innerHTML = song.album;
            album.classList.add("song-list-album");
            let artist = row.insertCell(0);
            artist.innerHTML = song.artist;
            artist.classList.add("song-list-artist");
            let title = row.insertCell(0);
            title.classList.add("song-list-title");
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
     * updates the title above the table
     * @param {string} name the title name
     */
    setListTitle(name) {
        let title = document.getElementById("playlist-title");
        title.innerHTML = name;
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
            closectxm();
            ctxmPlaylists(ele, [song]);
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

    /**
     * differentiates between shift click, ctrl click or normal when clicking on a row and filters appropriately
     * @param {event} event eventlistener event
     * @param {DOM} rowObj row DOM of the table
     * @param {songObj} song a song object containing title, artist, url...
     * @param {number} index the index of the song inside the table
     */
    toggleActive(event, rowObj, song, index) {
        if (event.ctrlKey) {
            let add = !(index in this.selectList);
            this.toggleSelect(rowObj, song, index, add);
        } else if (event.shiftKey) {
            this.unselectAll();
            this.lastSelectIndex = this.lastSelectIndex ?? 0;
            this.selectBetween(this.lastSelectIndex, index);
        } else {
            let add = !(index in this.selectList);
            this.unselectAll();
            this.toggleSelect(rowObj, song, index, add);
        }

        this.updateAddSelectBtn();
    }

    /**
     * toggles the visibility of the add selected button
     */
    updateAddSelectBtn() {
        if (!isEmpty(this.selectList)) {
            this.addSelectedBtn.style.display = "block";
        } else {
            this.addSelectedBtn.style.display = "none";
        }
    }

    selectBetween(start, end) {
        // find lower and upper end of selection
        let lower = Math.min(start, end);
        let upper = Math.max(start, end) + 1;
        // get selected range of songs
        let songs = this.songlist.slice(lower, upper);
        // get all row DOMs in that range
        let rows = [...document.querySelectorAll("#song-table tbody tr")];
        rows = rows.slice(lower, upper);

        for (let i = 0; i < rows.length; i++) {
            const relI = i + lower;
            this.toggleSelect(rows[i], songs[i], relI, true, false);
        }
    }

    /**
     * deselects all selected items on the table
     */
    unselectAll() {
        for (const id in this.selectList) {
            if (Object.hasOwnProperty.call(this.selectList, id)) {
                const rowObj = this.selectList[id].obj;
                rowObj.classList.remove("active-table-item");
            }
        }
        this.selectList = {};
    }

    /**
     * sets one row on the table to active or not
     * @param {dom} obj the dom object
     * @param {songobj} song the song object
     * @param {number} index the index of the row
     * @param {boolean} add if the row should be set to active or inactive
     * @param {boolean} saveLastIndex if the last index should be stored
     */
    toggleSelect(rowDOM, song, index, add, saveLastIndex = true) {
        if (!add) {
            rowDOM.classList.remove("active-table-item");
            delete this.selectList[index];
            this.lastSelectIndex = null;
        } else {
            rowDOM.classList.add("active-table-item");
            this.selectList[index] = {
                song: song,
                obj: rowDOM,
            };
            if (saveLastIndex) this.lastSelectIndex = index;
        }
    }
}

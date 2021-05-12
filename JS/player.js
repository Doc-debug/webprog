import { crawler } from "./crawler.js";
import { initSonglist } from "./songlist.js";
import { initPlayer } from "./playerMod.js";
import { createLoader } from "./util/loader.js";
("use strict");

/**
 * initializes everything on load
 */
window.onload = async function () {
    // creates loader until crawler is finished
    let loader = createLoader("indexing files please wait", "table-container");
    await crawler();
    loader.remove();
    initSonglist();
    initPlayer();
};

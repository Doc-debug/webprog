import { crawler } from "./crawler.js";
import { initSonglist } from "./songlist.js";
import { initPlayer } from "./playerMod.js";
("use strict");

/**
 * initializes everything on load
 */
window.onload = async function () {
    await crawler();
    initSonglist();
    initPlayer();
};

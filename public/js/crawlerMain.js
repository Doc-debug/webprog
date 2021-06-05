import { flattenTree } from "./util/object.js";
import { getObj, setObj } from "./util/localstorage.js";
import { crawlerPHP } from "./crawlerPHP.js";
import { crawlerJS } from "./crawlerJS.js";
import { log } from "./util/logger.js";
("use strict");

let tree = {};
/**
 * Depending on the settings this will either use the JS or the PHP crawler to get the music file data
 * @returns the filetree structure
 */
export async function crawler() {
    let crawler = getObj("settings").crawler;
    if (crawler == null) {
        crawler = 0; // set crawler to php for default
        setObj("crawler", crawler);
    }

    if (crawler == 0) {
        tree = await crawlerPHP();
        log("PHP crawler initialized!");
    } else {
        tree = await crawlerJS();
        log("JS crawler initialized!");
    }
}

/**
 * filters song list by given search string and tag
 * @param {string} title the search query
 * @param {string} tag the tag that is searched (artist, title, url...) "all" represents the whole object
 * @param {Array} [customList=tree] customList the list that is searched
 * @returns a list with matching songs
 */
export function find(title, tag = null, customList = tree) {
    let list = flattenTree(customList);
    // if tag is undefined search whole object
    if (tag == null || tag == "all") {
        return list.filter((ele) =>
            JSON.stringify(ele).toLowerCase().includes(title.toLowerCase())
        );
    } else {
        // if tag is specified search only tag
        return list.filter(
            (ele) =>
                tag in ele &&
                ele[tag] != null &&
                ele[tag].toLowerCase().includes(title.toLowerCase())
        );
    }
}

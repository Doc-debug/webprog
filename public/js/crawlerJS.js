import { id3fromFile } from "./util/id3v2.js";
import { decodeHTMLEntities } from "./util/convert.js";
import { modNestedObj, flattenTree } from "./util/object.js";
import { getObj, setObj } from "./util/localstorage.js";
("use strict");

/**
 * @type {Object} the object holding the file tree structure
 */
export var tree = {};

/**
 * @const {Promise<object>} promise for the file structure
 */
const promise = defer();
/**
 * @type {Array} a list of iframes to check if the recursion of createframe is still running
 */
let iframes = [];

/**
 * will initialize the crawler
 * @returns a promise with the tree structure. This can be awaited
 */
export async function crawlerJS() {
    // gets the file structure from the cache
    let cache = getObj("tree");
    if (cache != null) {
        tree = cache;
        // resolve if cache has been found
        promise.resolve(tree);
    }
    await createframe();
    return promise;
}

/**
 * recursively searches a folder by creating iframes and saves all files found in the tree object
 * @param {string} src the folder path which should be searched for files
 */
async function createframe(src = "./music") {
    let iframe = document.createElement("iframe");
    iframes.push(iframe);
    iframe.style.display = "none";
    iframe.src = src;
    // waits until iframe is fully loaded before reading body
    iframe.addEventListener("load", async function () {
        // call get data function
        await getData(iframe, src);

        // remove iframe dom
        iframe.remove();
        // remove iframe when done
        iframes.pop();
        // check if recursion is finished and then resolve, cache and return promise
        if (iframes.length == 0) {
            promise.resolve(tree);
            setObj("tree", tree);
            return promise;
        }
    });
    document.body.appendChild(iframe);
}

/**
 * gets the file structure from a given iframe and recursivly creates a new iframe for each folder
 * @param {dom} iframe the iframe that holds the data
 * @param {string} src the location of the folder that is currently read
 */
async function getData(iframe, src) {
    let treeTemp = {};
    // a list of folders that will be used for recursive call
    let folders = [];
    // get all list items from iframe
    let files = iframe.contentDocument.body.getElementsByTagName("li");
    for (const file of files) {
        let name = file.getElementsByTagName("a")[0].innerHTML.slice(1);
        name = decodeHTMLEntities(name);

        if (name.slice(-1) == "/") {
            // add folders as new object
            folders.push(name.slice(0, -1));
        } else if (["mp3", "oog"].indexOf(name.split(".").pop()) >= 0) {
            // add file if it has correct fileextension
            let url = src + "/" + name;
            let songData = await id3fromFile(url);
            if (songData != null) {
                songData["url"] = url;
                songData["folder"] = src;
                treeTemp[name] = songData;
            } else {
                // default object if ID3 could not be parsed
                treeTemp[name] = {
                    url: url,
                    folder: src,
                    title: name,
                    album: "",
                    artist: "",
                    length: 0,
                };
            }
        }
    }

    // add to full tree
    modNestedObj(tree, src.split("/"), treeTemp);
    for (const i in folders) {
        let nextSrc = src + "/" + folders[i];
        await createframe(nextSrc);
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
                ele[tag].toLowerCase().includes(title.toLowerCase())
        );
    }
}

/**
 * returns promise that can be resolved from outside
 * @returns the promise
 */
function defer() {
    // the functions that have a global scope
    var res, rej;
    // create the promise
    var promise = new Promise((resolve, reject) => {
        // overwrite promise functions
        res = resolve;
        rej = reject;
    });

    // overwrite promise functions
    promise.resolve = res;
    promise.reject = rej;

    return promise;
}

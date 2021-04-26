import { id3fromFile } from "./util/id3v2.js";
import { decodeHTMLEntities } from "./util/convert.js";
import { modNestedObj, flattenTree } from "./util/object.js";
("use strict");

export async function crawler() {
    await createframe();
    return promise;
}

const promise = defer();
// a list of iframes to check if the recursion is still running
let iframes = [];
// creates an invisible iframe
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
        // check if recursion is finished and then resolve and return promise
        if (iframes.length == 0) {
            promise.resolve(tree);
            return promise;
        }
    });
    document.body.appendChild(iframe);
}

export var tree = {};
// recursivley reads files in music directory
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
                treeTemp[name] = songData;
            } else {
                // default object if ID3 could not be parsed
                treeTemp[name] = { url: url, title: name };
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

// filters song list by given search string and tag (artist, title, url...)
export function find(title, tag = null) {
    let list = flattenTree(tree);
    // if tag is undefined search whole object
    if (tag == null) {
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

// returns promise that can be resolved from outside
function defer() {
    var res, rej;

    var promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });

    promise.resolve = res;
    promise.reject = rej;

    return promise;
}

import { id3fromFile } from "./util/id3v2.js";
import { decodeHTMLEntities } from "./util/convert.js";
import { modNestedObj, flattenTree } from "./util/object.js";
("use strict");

window.onload = function () {
    createFrame();
    setTimeout(() => {
        console.log(tree);
        console.log(find("test", "url"));
        console.log(find("bleach", "title"));
        console.log(find("anatu", "artist"));
    }, 2000);
};

// creates an invisible iframe
async function createFrame(src = "./music") {
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = src;
    // waits until iframe is fully loaded before reading body
    iframe.addEventListener("load", async function () {
        // call get data function
        await getData(iframe, src);

        // remove iframe dom
        iframe.remove();
    });

    document.body.appendChild(iframe);
}

var tree = {};
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
        await createFrame(nextSrc);
    }
}

// filters song list by given search string and tag (artist, title, url...)
function find(titel, tag) {
    let list = flattenTree(tree);
    return list.filter(
        (ele) =>
            tag in ele && ele[tag].toLowerCase().includes(titel.toLowerCase())
    );
}

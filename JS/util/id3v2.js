import { str2ab } from "./convert.js";
import { getFile } from "./httpRequest.js";
("use strict");
/**
 * gets a song file from a given url and returns an object containing ID3 information
 * @param {string} url the url of the file
 * @returns an object containing ID3 information
 */
export async function id3fromFile(url) {
    let file = await getFile(url);
    return readID3v2(file);
}

/**
 * creates a data object using the ID3v2 layout
 * @param {string} str data string of the file
 * @returns object containing ID3 information
 */
function readID3v2(str) {
    if (str.slice(0, 3) != "ID3") return null;
    let data = {};
    data.title = readID3v2Tag(str, "TIT2");
    data.artist = readID3v2Tag(str, "TPE1");
    data.type = readID3v2Tag(str, "TCON");
    data.album = readID3v2Tag(str, "TALB");
    data.length = readID3v2Tag(str, "TLEN");
    return data;
}

/**
 * finds the data string to a given ID3v2 tag
 * @param {string} str data string of the file
 * @param {string} tag the searched ID3 tag
 * @param {number} tagOffset offset of the tag data
 * @param {boolean}[every2nd=11] every2nd skips every second byte
 * @returns data from ID3 tag field
 */
function readID3v2Tag(str, tag, tagOffset = 11, every2nd = false) {
    let end, start;
    // find tag
    end = start = str.indexOf(tag) + tagOffset;
    // read byte values for characters and iterate until command char was found (ASCII CMD vals < 32)
    var dataV = new DataView(str2ab(str[end]));
    while (dataV.getUint8(0) >= 32 || dataV.getUint8(0) == 0) {
        end++;
        dataV = new DataView(str2ab(str[end]));
    }
    end -= 7; // cut off next tag
    str = str.slice(start, end);
    // remove every other character cause somehow there are spaces after each char???
    if (every2nd) {
        let ret = "";
        for (let i = 0; i < str.length; i += 2) {
            ret += str[i];
        }
        return ret;
    } else {
        // replace weird unicode chars (everything except alphanumerical and some special chars)
        return str.replace(/[^\w!?\.'",;:\_\- ()\[\]\{\}&%$]+/g, "");
    }
}

import { str2ab } from "./convert.js";
import { getFile } from "./httpRequest.js";

export async function id3fromFile(url) {
    let file = await getFile(url);
    return readID3v2(file, url);
}
// creates a data object using the ID3v2 layout
export function readID3v2(str, url) {
    if (str.slice(0, 3) != "ID3") return null;
    let data = {};
    data.title = readID3v2Tag(str, "TIT2");
    data.artist = readID3v2Tag(str, "TPE1");
    data.type = readID3v2Tag(str, "TCON");
    data.album = readID3v2Tag(str, "TALB");
    data.length = readID3v2Tag(str, "TLEN", 11, false);
    data.url = url;
    return data;
}
// finds the data string to a given ID3v2 tag
export function readID3v2Tag(str, tag, tagOffset = 13, every2nd = true) {
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
        return str;
    }
}

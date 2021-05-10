"use strict";
/**
 * converts a string into an array buffer
 * @param {string} str the data string
 * @returns an array buffer
 */
export function str2ab(str) {
    // create arraybuffer with 2 bytes per char
    var buf = new ArrayBuffer(str.length * 2);
    // create view to edit arraybuffer
    var bufView = new Uint16Array(buf);
    // insert data
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * converts an array buffer into a string object
 * @param {ArrayBuffer} buf the buffer object
 * @returns the string
 */
export function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// decode html entities (e.g. &amp => &)
/**
 * converts all HTML entities in a string into unicode chars
 * @param {string} text a text string
 * @returns the converted string
 */
export function decodeHTMLEntities(text) {
    // a list of all entities
    var entities = [
        ["amp", "&"],
        ["apos", "'"],
        ["#x27", "'"],
        ["#x2F", "/"],
        ["#39", "'"],
        ["#47", "/"],
        ["lt", "<"],
        ["gt", ">"],
        ["nbsp", " "],
        ["quot", '"'],
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(
            new RegExp("&" + entities[i][0] + ";", "g"),
            entities[i][1]
        );

    return text;
}

/**
 * pads a number with zeros for the amount of digits given
 * @param {number} num the number
 * @param {number} digits amount of digits
 * @returns the zero padded number
 */
export function pad(num, digits = 2) {
    if (isNaN(num) || num == null) return "0".repeat(digits);
    return "0".repeat(digits - String(num).length) + String(num);
}

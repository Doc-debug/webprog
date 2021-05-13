"use strict";

/**
 *
 * @param {number} seconds
 * @returns and array of minutes and seconds in format [minutes, seconds]
 */
export function secondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    return [minutes, seconds];
}

/**
 * Takes an array of minutes and seconds in format [minutes, seconds] and returns a timestring
 * @param {Array[number, number]} minSec
 * @returns a timestring in format "mm:ss"
 */
export function prettyTimeString(minSec) {
    return (
        (minSec[0] < 10 ? "0" : "") +
        minSec[0] +
        ":" +
        (minSec[1] < 10 ? "0" : "") +
        minSec[1]
    );
}

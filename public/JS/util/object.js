"use strict";
/**
 * will update a nested object in a given object with a provided path and value
 * path should be array of keys e.g.: ["key1", "key2", ...]
 * @param {object} obj the object
 * @param {array} path path to the key value e.g.: ["key1", "key1.1", ...]
 * @param {*} value the new value that replaces the old one
 */
export function modNestedObj(obj, path, value) {
    let len = path.length;
    // iterate through path and create new nested object if path does not exist
    for (let i = 0; i < len - 1; i++) {
        let elem = path[i];
        // create new nested object if path does not exist
        if (!obj[elem]) obj[elem] = {};
        obj = obj[elem];
    }
    obj[path[len - 1]] = value;
}

/**
 * recurse traverse that returns a flat array with all songs
 * takes one object and two pseudo functions for filtering
 * @param {object} obj the object to flatten
 * @param {function} file determines which objects counts as a file
 * @param {function} folder determines what counts as a folder
 * @returns
 */
export function flattenTree(
    obj,
    file = (x) => "url" in x,
    folder = (x) => true
) {
    let files = [];
    for (const key in obj) {
        if (!obj[key] instanceof Object || file(obj[key])) {
            // add file to array if not an object or file function is true
            files.push(obj[key]);
        } else if (obj[key] instanceof Object && folder(obj[key])) {
            // recursive call if new folder was found
            files = files.concat(flattenTree(obj[key]));
        }
    }
    return files;
}

/**
 * sort array of objects by key
 * @param {array} objarr an array containing objects
 * @param {string} key the key by which the array is sorted
 * @param {number} sortDir the sorting direction (1 or -1)
 * @returns the sorted array
 */
export function arrSort(objarr, key, sortDir) {
    // use array.sort for sorting
    return objarr.sort(function (a, b) {
        // pass key and compare with <>

        let x = a[key];
        let y = b[key];
        // to lowercase if its a string
        x = typeof x === "string" ? x.toLowerCase() : x;
        y = typeof y === "string" ? y.toLowerCase() : y;
        // move to the bottom if null
        if (x == null) return 1;
        if (y == null) return -1;
        return x < y ? -1 * sortDir : x > y ? 1 * sortDir : 0;
    });
}

/**
 * Randomly shuffles an array
 * @param {array} array the given array
 * @returns the new random array
 */
export function arrShuffle(array) {
    array = array.slice(0);
    //Shuffle array using Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        // exchange current item with item at random position
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Takes an array of songobjects and splits it into subarrays based on common key name
 * [{a: 1}, {a: 1}, {a: 2}, {a: 2}] => [{name: 1, songs:[{a: 1}, {a: 1}]}, {name: 1, songs:[{a: 2}, {a: 2}]}]
 * @param {Array} arr the array
 * @param {string} the key name
 */
export function splitArr(arr, tag) {
    // sort arr
    let data = arrSort(arr, tag, 1);
    let lastTagName = data[0][tag];
    let completeArr = [];
    let tempArr = [];
    // check if tag is same as last object and if not create new array
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e[tag] == lastTagName) {
            tempArr.push(e);
        } else {
            completeArr.push({ name: lastTagName, songs: arrClone(tempArr) });
            tempArr = [];
            tempArr.push(e);
        }
        lastTagName = e[tag];
    }
    completeArr.push({ name: lastTagName, songs: arrClone(tempArr) });
    return completeArr;
}

/**
 * creates a copy of an array
 * @param {array} array the array to clone
 * @returns cloned array
 */
export function arrClone(array) {
    return array.slice(0);
}

/**
 * creates a clone of a given object.
 * (WARNING: this might stringify some values (dates, etc) and delete undefined keys)
 * @param {object} obj the object to clone
 * @returns an object clone
 */
export function objClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

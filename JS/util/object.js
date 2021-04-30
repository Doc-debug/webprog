// will update a nested object in a given object with a provided path and value
// path should be array of keys e.g.: ["key1", "key2", ...]
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

// recurse traverse that returns a flat array with all songs
// takes one object and two pseudo functions for filtering
export function flattenTree(
    obj,
    file = (x) => "url" in x,
    folder = (x) => true
) {
    let songs = [];
    for (const key in obj) {
        if (!obj[key] instanceof Object || file(obj[key])) {
            // add file to array
            songs.push(obj[key]);
        } else if (obj[key] instanceof Object && folder(obj[key])) {
            // recursive call if new folder was found
            songs = songs.concat(flattenTree(obj[key]));
        }
    }
    return songs;
}

// sort array of objects by key
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
 * Random shuffles an array
 * @param {*} array
 */
export function arrShuffle(array) {
    //Shuffle array using Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        console.log(i, array[i]["title"]);
        console.log(j, array[j]["title"]);
        //[array[i], array[j]] = [array[j], array[i]];
        let save = array[i];
        array[i] = array[j];
        array[j] = save;
        console.log("  ");
    }
    console.log(array);
}

export function arrClone(array) {
    return JSON.parse(JSON.stringify(array));
}

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

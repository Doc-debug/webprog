/**
 * saves an object in the local storage
 * @param {string} name name of the local storage field
 * @param {Object} obj the object that should be added
 */
export function setObj(name, obj) {
    let dataString = JSON.stringify(obj);
    window.localStorage.setItem(name, dataString);
}
/**
 * returns an object from a given local storage field
 * @param {string} name name of local storage field
 * @returns the object
 */
export function getObj(name) {
    let dataString = window.localStorage.getItem(name);
    return JSON.parse(dataString);
}

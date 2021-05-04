export function setObj(name, obj) {
    let dataString = JSON.stringify(obj);
    window.localStorage.setItem(name, dataString);
}
export function getObj(name) {
    let dataString = window.localStorage.getItem(name);
    return JSON.parse(dataString);
}

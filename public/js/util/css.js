("use strict");

/**
 * check if the current device is mobile or not
 * since user agent sniffing is not the best practice please be carful where to use this
 * @returns true or false
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

/**
 * checks if a given dom element contains a class
 * thanks to https://jaketrent.com/post/addremove-classes-raw-javascript
 *
 * @param {DOM} el the element to check
 * @param {String} className the class name
 * @returns
 */
export function hasClass(el, className) {
    return (" " + el.className + " ").indexOf(" " + className + " ") > -1;
    if (el.classList) return el.classList.contains(className);
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}

/**
 * adds a class to a given dom element
 * @param {DOM} el the element
 * @param {String} className the class name
 * @returns
 */
export function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
}

/**
 * removes a class from a given dom element
 * @param {DOM} el the element
 * @param {String} className the class name
 * @returns
 */
export function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else if (hasClass(el, className)) {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        el.className = el.className.replace(reg, " ");
    }
}

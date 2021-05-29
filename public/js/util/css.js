("use strict");

// thanks to https://jaketrent.com/post/addremove-classes-raw-javascript

/**
 * checks if a given dom element contains a class
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

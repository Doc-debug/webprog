import { getObj } from "./localstorage.js";
("use strict");

/**
 * if logging is enabled or not
 * to prevent the continuous call of the local storage the value is cached
 */
let enabled = null;

/**
 * gets from the local storage if logging should be on or off
 * @returns true or false to indicate if logging should be active
 */
function init() {
    if (enabled == null) {
        enabled = getObj("settings").logging;
        enabled = enabled != null && enabled != undefined && enabled;
    }
    return enabled;
}

/**
 * sets a state for the logger (active / not active)
 * @param {boolean} optional state if logging should be set to active. if null it will just toggle the current value
 */
export function toggleLogging(state = null) {
    if (state == null) enabled = !enabled;
    else enabled = state;
}

/**
 * logs a message in the console. This function exists so it can be toggled off when debugging
 * @param {string} obj message to log
 */
export function log(obj) {
    if (init()) {
        console.log(obj);
    }
}
/**
 * logs a message in the console. This function exists so it can be toggled off when debugging
 * @param {string} obj message to log
 */
export function warn(obj) {
    if (init()) {
        console.warn(obj);
    }
}
/**
 * logs a message in the console. This function exists so it can be toggled off when debugging
 * @param {string} obj message to log
 */
export function err(obj) {
    if (init()) {
        console.error(obj);
    }
}

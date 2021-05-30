import { opacityAnim, strokeAnim, destroy } from "./svganim.js";
import { getSetting } from "../settings.js";

/**
 * creates a loader that can be added to any parent dom object
 * @param {string} message the text above the loader
 * @param {string} parentID the objectid of the parent
 * @returns the container of the loader
 */
export function createLoader(message, parentID) {
    // loader text
    let text = document.createElement("h2");
    text.innerHTML = message;

    // container holding loader line (the one that is moving)
    let loaderLineContainer = document.createElement("div");
    loaderLineContainer.id = "loader-line-container";
    let loaderLine = document.createElement("div");
    loaderLineContainer.appendChild(loaderLine);

    // most outer container that contains all other objects
    let container = document.createElement("div");
    container.id = "loader";
    container.appendChild(text);
    container.appendChild(loaderLineContainer);

    document.getElementById(parentID).appendChild(container);

    return container;
}

/**
 * contains all instructions for the loading animation
 * @returns if disabled
 */
export function pageLoader() {
    let loader = document.getElementById("page-loader");
    if (!getSetting("pageloader")) {
        loader.remove();
        return;
    }
    loader.style.display = "flex";

    opacityAnim("page-loader-circle-ring", 1, 0);
    opacityAnim("page-loader-outer-circle", 1, 0);
    opacityAnim("page-loader-triangle", 1, 0);
    opacityAnim("page-loader-title", 1.5, 0.3);
    opacityAnim("page-loader-subtitle", 1.5, 0.6, true, 0.5);
}

/**
 * removes the animation when the animation is done
 * @returns if disabled
 */
export function pageLoaderClose() {
    let loader = document.getElementById("page-loader");
    if (!loader) return;
    strokeAnim("page-loader-circle-ring", 1, 2);
    opacityAnim("page-loader", 0.4, 3, false);
    destroy("page-loader", 3.5);
}

"use strict";
/**
 * if the ctxm is initialized or not. This will prevent the ctxm from being created multiple times
 */
let initialized = false;
/**
 * if the ctxm is currently open/visible rightn now. To prevent to call it twice
 */
let active = false;
/**
 * the dom element of the container for the context menu
 */
let container = null;
/**
 * initializes the context menu by setting it to visible and setting the position to the given element
 * @param {dom} ele the clicked object to spawn context menu at the same position
 * @returns the container dom
 */
export function initctxm(ele) {
    if (active) return null;
    active = true;
    if (!initialized) initialize();
    let pos = ele.getBoundingClientRect();
    // check if ctxm is outside window and move to left if true (120 = ctxm width)
    let offset = pos.x + 140 - window.innerWidth;
    offset = offset > 0 ? 120 : 0;

    container.innerHTML = "";
    container.style.position = "absolute";
    container.style.left = pos.x - offset + "px";
    container.style.top = pos.y + "px";
    document.body.appendChild(container);
    container.style.display = "block";
    return container;
}

/**
 * creates the container
 */
function initialize() {
    container = document.createElement("div");
    container.id = "context-menu";
    document.body.appendChild(container);
    // when clicking somewhere except the container itself the container will be hidden
    document.addEventListener("mousedown", function (e) {
        if (!container.contains(e.target)) {
            closectxm();
        }
    });
    initialized = true;
}

/**
 * closes the context menu
 */
export function closectxm() {
    container.style.display = "none";
    active = false;
}

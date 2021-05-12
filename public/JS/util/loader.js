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

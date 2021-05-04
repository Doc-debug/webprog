let initialized = false;
let container = null;
let enabled = false;
export function initctxm(ele) {
    if (!initialized) initialize();
    let pos = ele.getBoundingClientRect();
    container.innerHTML = "";
    container.style.position = "absolute";
    container.style.left = pos.x - 120 + "px";
    container.style.top = pos.y + "px";
    document.body.appendChild(container);
    container.style.display = "block";
    return container;
}

function initialize() {
    container = document.getElementById("context-menu");
    document.addEventListener("mousedown", function (e) {
        if (!container.contains(e.target)) {
            container.style.display = "none";
        }
    });
    initialized = true;
}

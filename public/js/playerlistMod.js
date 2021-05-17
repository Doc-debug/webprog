import { conf } from "./playerMod.js";

let active = false;
export function togglePList() {
    document.getElementById("player-playlist").style.display = active
        ? "none"
        : "block";

    active != active;
    console.log(conf);
}

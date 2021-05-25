import { Page } from "./util/pagegen.js";

let page;

export function initImpressum() {
    page = new Page(1000000);
    page.addObj(
        "div",
        '<img src="./img/brand/logo_new.svg" width="60px"></img>'
    );
    page.addObj("h1", "Radia music player");
    page.addObj(
        "p",
        "Radia music player© is a simple webplayer that uses basic Javascript, PHP8, and HTML5 to play your music."
    );
    page.addObj("h2", "About us");
    page.addObj(
        "p",
        "Hi and thank you for using Radia. We are just a small team of students who love to code and we hope that you like our little project."
    );
    page.addObj(
        "p",
        "If you are running into problems or just want to express how you feel about Radia don't hesitate to contact us:"
    );
    page.addObj("a", "f.schröder@ostfalia.de", [
        ["href", "mailto:f.schröder@ostfalia.de"],
    ]);
    page.addObj("br", "");
    page.addObj("a", "p.kontny@ostfalia.de", [
        ["href", "mailto:p.kontny@ostfalia.de"],
    ]);
    page.addObj("br", "");
    page.addObj("a", "j.naubert@ostfalia.de", [
        ["href", "mailto:j.naubert@ostfalia.de"],
    ]);
}

export function toggleImpressum() {
    page.toggle();
}

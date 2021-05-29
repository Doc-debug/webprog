import { Page } from "./util/pagegen.js";

let page;

/**
 * creates the body of the impressum with the pagegen script
 */
export function initImpressum() {
    page = new Page(1000000);
    page.addObj(
        "div",
        '<img src="./img/brand/logo_new.svg" width="60px"></img>'
    );
    page.addObj(
        "h1",
        "Radia <span style='font-weight: 200'>music player</span>"
    );
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
    page.addObj("a", "fa.schroeder@ostfalia.de<br>", [
        ["href", "mailto:fa.schroeder@ostfalia.de"],
    ]);
    page.addObj("a", "p.kontny@ostfalia.de<br>", [
        ["href", "mailto:p.kontny@ostfalia.de"],
    ]);
    page.addObj("a", "j.naubert@ostfalia.de<br>", [
        ["href", "mailto:j.naubert@ostfalia.de"],
    ]);

    page.addObj("h2", "Sources and websites that helped us ❤");

    page.addObj("a", "Google Fonts<br>", [
        ["href", "https://fonts.google.com/"],
        ["target", "_blank"],
    ]);

    page.addObj("a", "Github<br>", [
        ["href", "https://github.com/"],
        ["target", "_blank"],
    ]);

    page.addObj("a", "audio visualization guide<br>", [
        [
            "href",
            "https://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html",
        ],
        ["target", "_blank"],
    ]);

    page.addObj("a", "learnxinyminutes<br>", [
        ["href", "https://learnxinyminutes.com/docs/php/"],
        ["target", "_blank"],
    ]);

    page.addObj("a", "w3school<br>", [
        ["href", "https://www.w3schools.com/"],
        ["target", "_blank"],
    ]);
}

/**
 * toggles the impressum on and off (moves it up and down)
 */
export function toggleImpressum() {
    page.toggle();
}

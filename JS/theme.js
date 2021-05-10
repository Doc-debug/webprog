import { getObj, setObj } from "./util/localstorage.js";
("use strict");

let themes = [
    {
        "--bg-primary": "#1e2025",
        "--bg-secondary": "#212328",
        "--bg-tertionary": "#3e3f42",
        "--text": "#ffffffde",
        "--contrast": "#e74c3c",
    },
    {
        "--bg-primary": "#ffffff",
        "--bg-secondary": "#f2f3f5",
        "--bg-tertionary": "#e3e5e8",
        "--text": "#000000de",
        "--contrast": "#e74c3c",
    },
    {
        "--bg-primary": "#880033",
        "--bg-secondary": "#0000ff",
        "--bg-tertionary": "#ff0000",
        "--text": "#000000",
        "--contrast": "#00ff00",
    },
];

let currentTheme = 0;
let themeCustom = getObj("themeCustom");
if (themeCustom != null) themes[3] = themeCustom;
let theme = getObj("theme");
if (theme != null) setTheme(parseInt(theme));

window.setTheme = setTheme;
/**
 * will switch between dark and bright mode
 * @param colorTheme will toggle on none or use white mode on white or dark on dark
 */
function setTheme(colorTheme = (currentTheme + 1) % 2) {
    for (const key in themes[colorTheme]) {
        document.documentElement.style.setProperty(
            key,
            themes[colorTheme][key]
        );
    }

    currentTheme = colorTheme;
    setObj("theme", currentTheme);
}

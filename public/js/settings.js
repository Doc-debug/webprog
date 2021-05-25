import { getObj, setObj } from "./util/localstorage.js";
("use strict");

window.addEventListener("load", function () {
    initEventListeners();
    initTheme();
});

let settingsEnabled = false;

function initEventListeners() {
    let openSettings = document.getElementById("settings-btn");
    let closeSettings = document.getElementById("settings-close-btn");
    let deleteLocalStorageBtn = document.getElementById(
        "setting-delete-localstorage"
    );
    openSettings.addEventListener("click", () => {
        toggleSettings(true);
    });
    closeSettings.addEventListener("click", () => {
        toggleSettings(false);
    });
    deleteLocalStorageBtn.addEventListener("click", () => {
        resetLocalStorage();
    });
}

function toggleSettings(open = null) {
    if (open == null) settingsEnabled = !settingsEnabled;
    else settingsEnabled = open;

    let pos = settingsEnabled ? "0" : "-100%";

    let settingsDOM = document.getElementById("settings-container");
    settingsDOM.style.top = pos;
}

// theme functions
let themes = [
    {
        "--bg-primary": "#1e2025",
        "--bg-secondary": "#212328",
        "--bg-tertionary": "#3e3f42",
        "--text": "#ffffff",
        "--contrast": "#e74c3c",
    },
    {
        "--bg-primary": "#ffffff",
        "--bg-secondary": "#f2f3f5",
        "--bg-tertionary": "#e3e5e8",
        "--text": "#000000",
        "--contrast": "#e74c3c",
    },
    {
        "--bg-primary": "#000000",
        "--bg-secondary": "#0d0d0d",
        "--bg-tertionary": "#1a1a1a",
        "--text": "#ffffff",
        "--contrast": "#e32b2b",
    },
];

let currentTheme;

/**
 * gets settings from local storage and updates all theme related variables
 */
function initTheme() {
    currentTheme = 0;
    let themeCustom = getObj("themeCustom");
    if (themeCustom != null) themes[2] = themeCustom;
    let theme = getObj("theme");
    if (theme != null) setTheme(parseInt(theme));

    let themePicker = document.getElementById("theme-select");
    let customPBG = document.getElementById("custom-theme-pri-bg");
    let customSBG = document.getElementById("custom-theme-sec-bg");
    let customTBG = document.getElementById("custom-theme-ter-bg");
    let customTXT = document.getElementById("custom-theme-text");
    let customCON = document.getElementById("custom-theme-contrast");

    themePicker.value = currentTheme;
    customPBG.value = themes[2]["--bg-primary"];
    customSBG.value = themes[2]["--bg-secondary"];
    customTBG.value = themes[2]["--bg-tertionary"];
    customTXT.value = themes[2]["--text"];
    customCON.value = themes[2]["--contrast"];

    themePicker.addEventListener("change", function () {
        setTheme(this.value);
    });

    customPBG.addEventListener("change", () => {
        updateCustomTheme("--bg-primary", customPBG.value);
    });
    customSBG.addEventListener("change", () => {
        updateCustomTheme("--bg-secondary", customSBG.value);
    });
    customTBG.addEventListener("change", () => {
        updateCustomTheme("--bg-tertionary", customTBG.value);
    });
    customTXT.addEventListener("change", () => {
        updateCustomTheme("--text", customTXT.value);
    });
    customCON.addEventListener("change", () => {
        updateCustomTheme("--contrast", customCON.value);
    });
}
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

function updateCustomTheme(key, hex) {
    themes[2][key] = hex;
    setObj("themeCustom", themes[2]);
    if (currentTheme == 2) setTheme(2);
}

// Performance options

function resetLocalStorage() {
    let confirmation = confirm(
        "are you sure you want to reset the local storage? This includes all your playlists and personalization settings!"
    );
    if (confirmation) {
        window.localStorage.clear();
    }
}

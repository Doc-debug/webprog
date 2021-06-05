import { getObj, setObj } from "./util/localstorage.js";
import { toggleLogging } from "./util/logger.js";
import { initImpressum, toggleImpressum } from "./impressum.js";
("use strict");

/**
 * init all necessary settings when the page is loading
 */
window.addEventListener("load", function () {
    let localSettings = getObj("settings");
    settings = localSettings ?? settings;

    initEventListeners();
    initTheme();
    initImpressum();
});

/**
 * @type {object} holds all default settings and will be replaced if the localstorage is not null
 */
let settings = {
    crawler: 0,
    logging: false,
    pageloader: false,
    currentTheme: 0,
    themes: [
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
    ],
};

/**
 * updates the settings in the local storage
 */
function updateSettings() {
    setObj("settings", settings);
}

/**
 * gets the settings for a specified key
 * @param {string} key the key with the requested data
 * @returns the corresponding values
 */
export function getSetting(key) {
    if (key in settings) {
        return settings[key];
    }
    return null;
}

/**
 * indicates wether the settings panel is open
 */
let settingsEnabled = false;

/**
 * initializes all needed eventlistener
 */
function initEventListeners() {
    let openSettings = document.getElementById("settings-btn");
    let closeSettings = document.getElementById("settings-close-btn");
    let deleteLocalStorageBtn = document.getElementById(
        "setting-delete-localstorage"
    );
    let impressumBtn = document.getElementById("impressum");
    let crawlerSetting = document.getElementById("crawler-select");
    let loggingCheckbox = document.getElementById("logging-checkbox");
    let loadingCheckbox = document.getElementById("loading-anim-checkbox");

    crawlerSetting.value = settings.crawler;
    loggingCheckbox.checked = settings.logging;
    loadingCheckbox.checked = settings.pageloader;

    openSettings.addEventListener("click", () => {
        toggleSettings(true);
    });
    closeSettings.addEventListener("click", () => {
        toggleSettings(false);
    });
    deleteLocalStorageBtn.addEventListener("click", () => {
        resetLocalStorage();
    });
    impressumBtn.addEventListener("click", () => {
        toggleImpressum();
    });

    crawlerSetting.addEventListener("change", function () {
        settings.crawler = parseInt(this.value);
        updateSettings();
    });
    loggingCheckbox.addEventListener("change", function () {
        toggleLogging(this.checked);
        settings.logging = this.checked;
        updateSettings();
    });
    loadingCheckbox.addEventListener("change", function () {
        settings.pageloader = this.checked;
        updateSettings();
    });
}

/**
 * closes or opens the settings panel
 * @param {boolean} open if the settings should be opened or closed
 */
function toggleSettings(open = null) {
    if (open == null) settingsEnabled = !settingsEnabled;
    else settingsEnabled = open;

    let pos = settingsEnabled ? "0" : "-100%";

    let settingsDOM = document.getElementById("settings-container");
    settingsDOM.style.top = pos;
}

let currentTheme;

/**
 * gets settings from local storage and updates all theme related variables
 */
function initTheme() {
    currentTheme = settings.currentTheme;
    let customTheme = settings.themes[2];
    setTheme(currentTheme);

    let themePicker = document.getElementById("theme-select");
    let customPBG = document.getElementById("custom-theme-pri-bg");
    let customSBG = document.getElementById("custom-theme-sec-bg");
    let customTBG = document.getElementById("custom-theme-ter-bg");
    let customTXT = document.getElementById("custom-theme-text");
    let customCON = document.getElementById("custom-theme-contrast");

    themePicker.value = currentTheme;
    customPBG.value = customTheme["--bg-primary"];
    customSBG.value = customTheme["--bg-secondary"];
    customTBG.value = customTheme["--bg-tertionary"];
    customTXT.value = customTheme["--text"];
    customCON.value = customTheme["--contrast"];

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
    for (const key in settings.themes[colorTheme]) {
        document.documentElement.style.setProperty(
            key,
            settings.themes[colorTheme][key]
        );
    }

    currentTheme = colorTheme;
    settings.currentTheme = currentTheme;
    updateSettings();
}

function updateCustomTheme(key, hex) {
    settings.themes[2][key] = hex;
    updateSettings();
    if (currentTheme == 2) setTheme(2);
}

// Performance options

/**
 * deletes all items in the local storage (with confirm prompt)
 */
function resetLocalStorage() {
    let confirmation = confirm(
        "are you sure you want to reset the local storage? This includes all your playlists and personalization settings!"
    );
    if (confirmation) {
        window.localStorage.clear();
    }
}

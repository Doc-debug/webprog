<link rel="stylesheet" type="text/css" href="css/settings.css" />
<script type="module" src="js/settings.js"></script>


<!-- the settings page that can be opened by the button in the top left -->
<div id="settings-container">
    <!-- prettier-ignore -->
    <a id="settings-close-btn">
        <svg viewBox="0 0 500 500">
            <path class="fill" d="M84,430.8c-4,0-7.7-1.5-10.5-4.3s-4.3-6.5-4.3-10.5s1.5-7.7,4.3-10.5L229,250L73.5,94.5c-5.8-5.8-5.8-15.2,0-21c2.8-2.8,6.5-4.3,10.5-4.3s7.7,1.5,10.5,4.3L250,229L405.5,73.5c2.8-2.8,6.5-4.3,10.5-4.3s7.7,1.5,10.5,4.3s4.3,6.5,4.3,10.5s-1.5,7.7-4.3,10.5L271,250l155.5,155.5c5.8,5.8,5.8,15.2,0,21c-2.8,2.8-6.5,4.3-10.5,4.3s-7.7-1.5-10.5-4.3L250,271L94.5,426.5C91.7,429.3,88,430.8,84,430.8z" />
        </svg>
    </a>
    <div id="settings-body">
        <h1>Settings</h1>
        <a id="impressum">About us</a>
        <h2>Preferences</h2>
        <div class="setting">
            <p>language</p>
            <select id="language-select">
                <option value="english">english</option>
            </select>
        </div>
        <div class="setting">
            <p>enable loading animation</p>
            <input type="checkbox" id="loading-anim-checkbox" />
        </div>
        <h2>Personalize</h2>
        <div class="setting">
            <p>theme</p>
            <select id="theme-select">
                <option value="0">dark</option>
                <option value="1">light</option>
                <option value="2">custom</option>
            </select>
        </div>
        <h3>Set colors for custom theme</h3>
        <div class="setting">
            <p>primary background</p>
            <input type="color" id="custom-theme-pri-bg" />
        </div>
        <div class="setting">
            <p>secondary background</p>
            <input type="color" id="custom-theme-sec-bg" />
        </div>
        <div class="setting">
            <p>tertionary background</p>
            <input type="color" id="custom-theme-ter-bg" />
        </div>
        <div class="setting">
            <p>contrast color</p>
            <input type="color" id="custom-theme-contrast" />
        </div>
        <div class="setting">
            <p>text color</p>
            <input type="color" id="custom-theme-text" />
        </div>
        <h2>Performance</h2>
        <div class="setting">
            <p>crawler</p>
            <select id="crawler-select">
                <option value="0">server(PHP)</option>
                <option value="1">local(JS IFrame)</option>
            </select>
        </div>
        <p class="info-text">
            Since the JS crawler downloads all songs to search for ID3
            tags this might have a severe impact on your data usage
        </p>
        <h2>Admin tools</h2>
        <div class="setting">
            <p>logging</p>
            <input type="checkbox" id="logging-checkbox" />
        </div>
        <button id="setting-delete-localstorage" class="critical">
            Erase all local data
        </button>
    </div>
</div>
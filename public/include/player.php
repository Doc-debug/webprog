<link rel="stylesheet" type="text/css" href="css/musicplayer.css" />
<!--The Player at the bottom of the page that holds all controls-->
<div id="player">
    <svg id="expand-player-list" viewBox="0 0 500 194.4">
        <polyline points="72.1,143.4 248.5,49.4 427.9,145 " />
    </svg>
    <div id="player-playlist">
        <canvas id="visualizer"></canvas>
        <table id="player-playlist-table" class="song-table"></table>
    </div>
    <div class="song-info no-select" id="song-info">
        <span class="title"></span>
        -
        <span class="artist"></span>
    </div>
    <!-- The container that holds all player buttons (play loop next prev slider etc.) -->
    <div id="control">
        <div id="progress-bar-container">
            <input type="range" min="1" max="100" value="0" class="slider" id="song-slider" />
            <p class="time left no-select">00:00</p>
            <p class="time right no-select">00:00</p>
        </div>
        <!-- control buttons in the middle of the player -->
        <!-- prettier-ignore -->
        <div class="buttons no-select">
            <button id="shuffle-control" class="ctrl-btn extra">
                <svg x="0px" y="0px" viewBox="0 0 500 500">
                    <path class="fill" d="M241.3,276.8c-9.3,10.9-19.3,21.2-30.9,29.9c-21.6,16.2-45.6,24.1-73.2,24.1h-29.5c-6.2,0-11.2-5-11.2-11.2c0-6.2,5-11.2,11.2-11.2h29.5c41.3,0,65.9-21.3,88.2-47.5L241.3,276.8z" />
                    <path class="fill" d="M372.2,179.5c0,6.2-5,11.2-11.2,11.2c-41,0-65.5,21.1-87.8,47.1L257.4,222c9.2-10.7,19.1-20.9,30.5-29.5c21.6-16.2,45.5-24.1,73.1-24.1C367.2,168.4,372.2,173.4,372.2,179.5z" />
                    <path class="fill" d="M361,330.8c-27.6,0-51.5-7.9-73.1-24.1c-18.6-14-33.3-32.3-47.5-50.1c-27-33.9-52.6-65.8-103.2-65.8h-29.5c-6.2,0-11.2-5-11.2-11.2s5-11.2,11.2-11.2h29.5c27.6,0,51.5,7.9,73.2,24.1c18.6,14,33.3,32.4,47.5,50.1c27,33.8,52.6,65.8,103.1,65.8c6.2,0,11.2,5,11.2,11.2C372.2,325.8,367.2,330.8,361,330.8z" />
                    <path class="fill" d="M414,176.7l-46.8-27c-1.9-1.1-4.4,0.3-4.4,2.5v54.1c0,2.2,2.4,3.6,4.4,2.5l46.8-27C416,180.6,416,177.8,414,176.7z" />
                    <path class="fill" d="M414,312l-46.8-27c-1.9-1.1-4.4,0.3-4.4,2.5v54.1c0,2.2,2.4,3.6,4.4,2.5l46.8-27C416,315.9,416,313.2,414,312z" />
                </svg>
            </button>
            <button id="back-control" class="ctrl-btn skip">
                <svg x="0px" y="0px" viewBox="0 0 500 500">
                    <polygon class="stroke" points="250,250 460,371.2 460,128.8 		" />
                    <polygon class="stroke" points="40,250 250,371.2 250,128.8 		" />
                </svg>
            </button>
            <button id="play-control" class="ctrl-btn">
                <svg id="play-svg" class="" x="0px" y="0px" viewBox="0 0 500 500">
                    <path d="M421,250c0,0,8.2-17.7-133.7-102.1c-125.3-74.5-143.6-58-143.6-58s-18.9,0-18.9,160.1s18.9,160.1,18.9,160.1s19.3,14.8,145.7-58.1C435.5,267.8,421,250,421,250z" />
                </svg>
                <svg id="pause-svg" class="invisible" x="0px" y="0px" viewBox="0 0 500 500">
                    <line x1="189" y1="101.1" x2="189" y2="399.2" />
                    <line x1="311" y1="101.1" x2="311" y2="399.2" />
                </svg>
            </button>
            <button id="skip-control" class="ctrl-btn skip">
                <svg x="0px" y="0px" viewBox="0 0 500 500">
                    <polygon class="stroke" points="250,250 40,128.8 40,371.2 		" />
                    <polygon class="stroke" points="460,250 250,128.8 250,371.2 		" />
                </svg>
            </button>
            <button id="loop-control" class="ctrl-btn extra">
                <svg x="0px" y="0px" viewBox="0 0 500 500">
                    <path class="fill" d="M434.3,250c0,45.7-37.1,82.8-82.8,82.8h-0.1v14.9c0,3.4-3.7,5.5-6.6,3.8l-47.2-27.3c-2.9-1.7-2.9-6,0-7.5l47.2-27.3c2.9-1.7,6.6,0.4,6.6,3.8v14.6h0.1c31.9,0,57.8-25.9,57.8-57.8c0-3.4-0.3-6.7-0.8-9.9c6.7-9.5,11.6-20.3,14.5-31.9C430.2,220.5,434.3,234.8,434.3,250z M249.6,320.3c0,6.9-5.6,12.5-12.5,12.5h-88.6c-45.7,0-82.8-37.1-82.8-82.8s37.1-82.8,82.8-82.8h0.1v-14.9c0-3.4,3.7-5.5,6.6-3.8l47.2,27.3c2.9,1.7,2.9,6,0,7.5l-47.2,27.3c-2.9,1.7-6.6-0.4-6.6-3.8v-14.6h-0.1c-31.9,0-57.8,25.9-57.8,57.8s25.9,57.8,57.8,57.8h88.6C244,307.8,249.6,313.4,249.6,320.3z M419.8,185.1c0,5.5-0.5,10.9-1.4,16.1v0c-2,11.2-6.1,21.7-11.9,31c-15.8,25.8-44.3,43-76.8,43c-49.8,0-90.1-40.3-90.1-90.1S280,95,329.7,95S419.8,135.3,419.8,185.1zM349.6,120.6h-2.7l-55.8,19.3v22.3l29-8.5v93.8h29.5V120.6z" />
                </svg>
            </button>
        </div>
    </div>
    <!-- volume control on the right side of the container -->
    <div class="no-select" id="volume-container">
        <button class="buttons" id="mute-control">
            <!-- prettier-ignore -->
            <svg viewBox="0 0 1000 1000">
                <polygon class="stroke" points="500,233 500,767 296.5,627.5 173,627.5 173,372.5 297.3,372.5 " />
                <path class="stroke" d="M559.6,402.5c0,0,47.2,20.9,47.2,97.5c0,73.5-47.2,97.5-47.2,97.5" />
                <path class="stroke" d="M617.6,354c0,0,70.7,31.3,70.7,146c0,110.1-70.7,146-70.7,146" />
                <path class="stroke" d="M666.8,292.2c0,0,100.6,44.5,100.6,207.8c0,156.6-100.6,207.8-100.6,207.8" />
            </svg>
        </button>
        <input type="range" min="0" max="100" value="0" class="slider no-select" id="volume-control" />
    </div>
</div>
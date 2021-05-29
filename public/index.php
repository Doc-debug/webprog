<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Radia music player</title>

    <link rel="icon" type="image/png" href="img/brand/favicon.png" />
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <link rel="stylesheet" type="text/css" href="css/index.css" />
    <link rel="stylesheet" type="text/css" href="css/header.css" />
    <link rel="stylesheet" type="text/css" href="css/songtable.css" />
    <link rel="stylesheet" type="text/css" href="css/pagegen.css" />

    <script type="module" src="js/main.js"></script>
</head>

<body class="no-select">
    <!-- load the page loader animation -->
    <?php include('include/pageloader.php'); ?>
    <div id="content">
        <!-- header of the site on the top -->
        <div id="header">
            <nav id="menu">
                <a id="settings-btn">
                    <!-- prettier-ignore -->
                    <svg viewBox="0 0 500 500">
                        <path class="stroke" d="M250,178.5c-39.5,0-71.5,32-71.5,71.5s32,71.5,71.5,71.5s71.5-32,71.5-71.5S289.5,178.5,250,178.5z M410.8,250c0-12.1-1.4-23.9-4-35.2l46.7-41.1l-35.7-61.9l-59,20c-17.3-15.9-37.9-28.2-60.9-35.4l-12.2-60.9h-71.5l-12.2,60.9c-23,7.2-43.6,19.5-60.9,35.4l-59-20l-35.7,61.9l46.7,41.1c-2.5,11.3-4,23.1-4,35.2c0,12.1,1.4,23.9,4,35.2l-46.7,41.1l35.7,61.9l59-20c17.3,15.9,37.9,28.2,60.9,35.4l12.2,60.9h71.5l12.2-60.9c23-7.2,43.6-19.5,60.9-35.4l59,20l35.7-61.9l-46.7-41.1C409.4,273.9,410.8,262.1,410.8,250z" />
                    </svg>
                </a>
            </nav>

            <div id="searchwrapper">
                <input type="text" id="searchbar" placeholder="Search.." />

                <select name="searchtag" id="searchtag">
                    <option value="all">all</option>
                    <option value="folder">folder</option>
                    <option value="album">album</option>
                    <option value="artist">artist</option>
                    <option value="title">title</option>
                </select>
            </div>
        </div>
        <!-- content of the site, holding the playlist list and song list  -->
        <div id="content-container">
            <div id="playlist-list">
                <a id="load-all-songs">all songs</a>
                <div id="playlist-folder-switch">
                    <a id="select-playlists-btn" class="active">playlists</a>
                    <a id="select-folders-btn" class="right">folders</a>
                </div>
                <a id="addplaylist" class="op-m">Add Playlist + </a>
                <div id="playlist-list-container"></div>
            </div>
            <div id="table-container">
                <div id="playlist-title-container">
                    <h2 id="playlist-title">test playlist</h2>
                    <div id="playlist-options">
                        <a id="playlist-option-rename">
                            <!-- prettier-ignore -->
                            <svg viewBox="0 0 500 500">
                                <path class="fill" d="M292.9,187.9l19.2,19.2L123.3,395.8h-19.2v-19.2L292.9,187.9 M367.9,62.5c-5.2,0-10.6,2.1-14.6,6l-38.1,38.1l78.1,78.1l38.1-38.1c8.1-8.1,8.1-21.3,0-29.4l-48.8-48.8C378.5,64.4,373.3,62.5,367.9,62.5z M292.9,129L62.5,359.4v78.1h78.1L371,207.1C371,207.1,292.9,129,292.9,129z" />
                            </svg>
                        </a>
                        <a id="playlist-option-delete">
                            <!-- prettier-ignore -->
                            <svg viewBox="0 0 500 500">
                                <path class="fill" d="M333.3,187.5v208.3H166.7V187.5H333.3 M302.1,62.5H197.9l-20.8,20.8h-72.9V125h291.7V83.3h-72.9L302.1,62.5z M375,145.8H125v250c0,22.9,18.8,41.7,41.7,41.7h166.7c22.9,0,41.7-18.8,41.7-41.7V145.8z" />
                            </svg>
                        </a>
                    </div>
                    <div id="other-table-options">
                        <a id="table-add-selected" style="display:none">
                            <!-- prettier-ignore -->
                            <svg viewBox="0 0 500 500">
                                <path class="fill" d="M465,280.7H280.7V465h-61.5V280.7H35v-61.5h184.3V35h61.5v184.3H465V280.7z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <table id="song-table" class="song-table"></table>
            </div>
        </div>
    </div>

    <!-- load music player (bottom of the page) -->
    <?php include('include/player.php'); ?>
    <!-- load the settings page -->
    <?php include('include/settings.php'); ?>

</body>

</html>
<?php

require_once('ID3v2Parser.php');

// Constants for the music directory
const MUSIC_ROOT = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'music';
const MUSIC_URL_ROOT = 'music';

// set api data to json
header('Content-Type: application/json');

// read files in directory
$fileList = scanDirRecursively(MUSIC_ROOT, MUSIC_URL_ROOT);

echo json_encode($fileList, JSON_PRETTY_PRINT);

/**
 * Reads all files in the music directory recursively and extracts id3 data
 * 
 * @param string $dirPath the absolute path to the music directory
 * @param string $relPath the relative path from the music dir root (for recursion)
 */
function scanDirRecursively(string $dirPath, $relPath): array
{
    // read files in directory
    $relPath .= '/';
    $files = scandir($dirPath);

    $fileList = [];


    foreach ($files as $fileName) {
        // skip the "back" and "current" folder (., ..)
        if (in_array($fileName, ['..', '.'])) continue;

        if (is_dir($path = $dirPath . DIRECTORY_SEPARATOR . $fileName)) {
            // call function again for every other directory
            $fileList[$fileName] = scanDirRecursively($path, $relPath . $fileName);
            if (empty($fileList[$fileName])) unset($fileList[$fileName]);
        } elseif (in_array(pathinfo($fileName, PATHINFO_EXTENSION), ['mp3', 'ogg'])) {
            // for each song file (mp3 and ogg) call the id3 parser and append fileList
            $songInfo = (new ID3v2Parser($path))->getSongInfo();
            $songInfo['folder'] = $relPath;
            $songInfo['url'] = $relPath . $fileName;
            if (!$songInfo['title']) $songInfo['title'] = pathinfo($fileName, PATHINFO_FILENAME);
            $fileList[$fileName] = $songInfo;
        }
    }
    return $fileList;
}

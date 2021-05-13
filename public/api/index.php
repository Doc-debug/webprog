<?php

require_once('ID3v2Parser.php');

const MUSIC_ROOT = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'music';

const MUSIC_URL_ROOT = 'music';


$file = MUSIC_ROOT . DIRECTORY_SEPARATOR . 'good.mp3';


header('Content-Type: application/json');

$fileList = scanDirRecursively(MUSIC_ROOT, MUSIC_URL_ROOT);


echo json_encode($fileList, JSON_PRETTY_PRINT);

function scanDirRecursively(string $dirPath, $relPath): array {

    $relPath .= '/';
    $files = scandir($dirPath);

    $fileList = [];

    foreach ($files as $fileName) {
        if (in_array($fileName, ['..', '.'])) continue;

        if (is_dir($path = $dirPath . DIRECTORY_SEPARATOR . $fileName)) {
            
            $fileList[$fileName] = scanDirRecursively($path, $relPath . $fileName);
            if (empty($fileList[$fileName])) unset($fileList[$fileName]);

        } elseif (in_array(pathinfo($fileName, PATHINFO_EXTENSION), ['mp3', 'ogg'])) {

            $songInfo = (new ID3v2Parser($path))->getSongInfo();
            $songInfo['folder'] = $relPath;
            $songInfo['url'] = $relPath . $fileName;
            if (!$songInfo['title']) $songInfo['title'] = pathinfo($fileName, PATHINFO_FILENAME);
            $fileList[$fileName] = $songInfo;
        }
    }
    return $fileList;
}

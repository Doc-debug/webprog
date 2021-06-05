<?php

class ID3v2Parser
{

    private string $fileHead;

    /**
     * Reads all id3(v2) data from a given song file
     * 
     * @param string $path the path to the music file
     */
    public function __construct(string $path)
    {

        $handle = fopen($path, 'r');

        $this->fileHead = fread($handle, 20000);

        fclose($handle);
        // replace all unreadable chars with ";;"
        $this->fileHead = preg_replace('/[\x00-\x1F\x80-\xFF]{2,}/', ';;', $this->fileHead);
        $this->fileHead = str_replace("\0", '', $this->fileHead);
    }
    /**
     * reads data from a specific ID3v2 tag
     * 
     * @param string $tagname the name of the tag (eg. "TIT2")
     */
    public function getTag(string $tagName): ?string
    {

        // pattern for value extraction (uses the ";;" that where set earlier to identify the location)
        $pattern = '/' . $tagName . ';;(.;;)?(?<value>[^;]+)[\w]{4}/';

        preg_match($pattern, $this->fileHead, $matches);
        return $matches['value'] ?? null;
    }

    /**
     * returns the song info for specified tags (containing: title, artist, type, length)
     */
    public function getSongInfo()
    {
        return [
            'title' => $this->getTag('TIT2') ?: $this->getTag('TIT3'),
            'artist' => $this->getTag('TPE1') ?: $this->getTag('TPE2') ?: $this->getTag('TPE3') ?: $this->getTag('TPE4'),
            'type' => $this->getTag('TCON'),
            'album' => $this->getTag('TALB'),
            'length' => intval($this->getTag('TLEN')) ?: null,
        ];
    }
}

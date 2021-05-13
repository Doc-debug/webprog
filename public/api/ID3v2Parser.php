<?php

class ID3v2Parser {

    private string $fileHead;

    public function __construct(string $path) {

        $handle = fopen($path, 'r');

        $this->fileHead = fread($handle, 20000);
        
        fclose($handle);
        
        $this->fileHead = preg_replace('/[\x00-\x1F\x80-\xFF]{2,}/', ';;', $this->fileHead);

        $this->fileHead = str_replace("\0", '', $this->fileHead);

        // var_dump($this->fileHead);

    }

    public function getTag(string $tagName) : ?string {
        
        $pattern = '/' . $tagName . ';;(.;;)?(?<value>[^;]+)[\w]{4}/';

        preg_match($pattern, $this->fileHead, $matches);

        return $matches['value'] ?? null;
    }

    public function getSongInfo() {
        return [
            'title' => $this->getTag('TIT2') ?: $this->getTag('TIT3'),
            'artist' => $this->getTag('TPE1') ?: $this->getTag('TPE2') ?: $this->getTag('TPE3') ?: $this->getTag('TPE4'),
            'type' => $this->getTag('TCON'),
            'album' => $this->getTag('TALB'),
            'length' => intval($this->getTag('TLEN')) ?: null,
        ];
    }
}
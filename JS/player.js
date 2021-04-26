"use strict";

window.onload = function(){
    initPlayer();
};

let playing, player, loop, shuffle, btnPlayPause, btnLoop, btnShuffle, btnSkip, btnBack;

function initPlayer(){
    //init player variables
    playing = false;
    loop = false;
    shuffle = false;
    player = document.getElementById("audioPlayer")

    btnPlayPause = document.getElementById("play-control");
    btnSkip = document.getElementById("skip-control");
    btnBack = document.getElementById("back-control");
    btnShuffle = document.getElementById("shuffle-control");
    btnLoop = document.getElementById("loop-control");
    
    //adding event listeners to buttons
    btnPlayPause.addEventListener("click", function(){
        switchPlayPause()
    });
    btnSkip.addEventListener("click", function(){
        audioSkip();
    } );
    btnBack.addEventListener("click", function(){
        audioBack();
    });
    btnShuffle.addEventListener("click", function(){
        audioShuffle();
    });
    btnLoop.addEventListener("click", function(){
        audioLoop();
    });

}

//Switch for play and pause
function switchPlayPause(){
    if (playing){
        audioPause();
    }else{
        audioPlay();
    }
}

//Set player to play
function audioPlay(){
    playing = true;
    player.play();
}

//Set player to pause
function audioPause(){
    playing = false;
    player.pause();
}

//Skipping song
function audioSkip(){
    //ToDo when track list implemented
}

//Got to song start or a song back
function audioBack(){
    //ToDo when track list implemented
}

//Switches shuffle
function audioShuffle(){
    //ToDo when track list implemented
}

//Switching loop control
function audioLoop(){
    loop = !loop;
    player.loop = loop;
    if (loop){
        //ToDo svg in --contrast
    }
}
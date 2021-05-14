var audioFilesSource = [
    "future funk beats.mp3",
    "SilentStar OrganSynth.mp3",
    "PAS3GROOVE1.mp3",
    "GrooveB Tanggu.mp3",
    "StompySlosh.mp3",
    "electric guitar coutry slide.mp3",
    "Bass Warwick heavy funk groove.mp3",
    "stutter breakbeats.mp3",
    "MazePolitics.mp3"
]
var audioFiles = []

for (let i = 0; i < 9; i++) {
    audioFiles[i] = new Audio(audioFilesSource[i]);
}

var buttons = [];
var isAnyMusicPLaying = false;

class MusicButton {
    constructor(id, audioFile, htmlElement) {
        this.id = id;

        this.audioFile = audioFile;
        this.audioFile.loop = true;

        this.htmlElement = htmlElement;
        this.htmlElement.appendChild(document.createTextNode(getAudioFileName(audioFilesSource[id])));

        this.isPlaying = false;
        this.shouldPlay = false;
        this.futurePlay = null;
        this.stopButton
    }

    onPress() {
        if (this.shouldPlay) {
            this.stopButton();
        } else {
            this.shouldPlay = true;
            this.htmlElement.style.backgroundColor = "#82c8a0";

            if (isAnyMusicPLaying) {
                this.futurePlay = setTimeout(() => { this.playButton() }, getNextLoopCycleInMiliSec())
            }
        }
    }

    stopButton() {
        this.clearPlannedFuturePlays();
        this.htmlElement.style.backgroundColor = "#fa5a5a";
        this.shouldPlay = false;
        this.audioFile.pause();
        this.audioFile.currentTime = 0;
        this.isPlaying = false;
    }

    playButton() {
        this.clearPlannedFuturePlays();
        this.htmlElement.style.backgroundColor = "#6698cb";
        this.isPlaying = true;
        this.shouldPlay = true;
        this.audioFile.play();
    }

    clearPlannedFuturePlays() {
        if (this.futurePlay != null) {
            clearTimeout(this.futurePlay);
            this.futurePlay = null;
        }
    }
}
function checkIfPress() {
    var checkBox = document.getElementById("playStop");
    if (checkBox.checked == true) {
        playPress();
    } else {
        stopPress();
    }
}
document.addEventListener('DOMContentLoaded', onLoad);
function onLoad() {
    for (i = 0; i < 9; i++) {
        buttons[i] = new MusicButton(i, audioFiles[i], document.getElementById(i));
    }
}

function onButtonPress(buttonId) {
    let id = parseInt(buttonId, 10);
    buttons[id].onPress();

    let isSomeonePlays = false;
    for (var i = 0; i < 9; i++) {
        isSomeonePlays = isSomeonePlays || buttons[i].isPlaying;
    }

    // if play was pressed, but all buttons were stopped manually, the next loop starts now 
    if (!isSomeonePlays && isAnyMusicPLaying) {
        playPress();
    }
}

function stopPress() {
    isAnyMusicPLaying = false;
    for (i = 0; i < buttons.length; i++) {
        buttons[i].stopButton();
    }
}

function playPress() {
    isAnyMusicPLaying = true;
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].shouldPlay) {
            buttons[i].playButton();
        }
    }
}

function getNextLoopCycleInMiliSec() {
    for (var i = 0; i < 9; i++) {
        if (buttons[i].isPlaying) {
            return (buttons[i].audioFile.duration - buttons[i].audioFile.currentTime) * 1000;
        }
    }

    // if we are playing, and no button is strated(probably manualy stopped), the next loop is now
    return 0;
}

function getAudioFileName(fullName) {
    return fullName.split(".")[0];
}
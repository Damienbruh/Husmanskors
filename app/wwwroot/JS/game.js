﻿let countdown;
let gridHeight = 9;
let gridWidth = 9;

const tile = $(".letterUI > * > .tile")

document.addEventListener("DOMContentLoaded", () => {
    createGrid(); // Initialize the grid

    document.getElementById("startGame").addEventListener("click", (event) => {
        startGame(event);
    });
});


async function startGame(e) {
    await placeWordInCenter(await testWord(e));
    startTimer(180);
}


async function getGameSettings() {
    const response = await fetch('/get-game-settings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}


async function testWord(e) {

    e.preventDefault(); // not reload page on form submit
    const response = await fetch(`/new-word?length=${gridWidth.toString()}`); // get (read)

    console.log('response', response);

    const startWord = await response.text();

    console.log('startWord: ', startWord);
    return startWord;
}


function createGrid() {
    const gridContainer = document.getElementById('gameGrid');
    if (!gridContainer) {
        console.error('No grid container found');
        return;
    }


    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 40px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 40px)`;

    let wordRow = Math.floor(gridHeight/2);
    let wordStartIndex = wordRow * gridWidth;

    for (let i = 0; i < gridHeight * gridWidth; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        if(i >= wordStartIndex && i < wordStartIndex + gridWidth){
            cell.classList.add("start-word");
        }
        gridContainer.appendChild(cell);
        console.log(i);
    }
}


function placeWordInCenter(word) {
    const gridContainer = document.getElementById("gameGrid");
    if (!gridContainer) {
        console.error("Grid container not found!");
        return;
    }
    for(let i = 0; i < word.length; i++){
        const clone = $('.letterUI').find(`#${word[i]}`).clone();
        clone.appendTo($('#gameGrid  .start-word').eq(i).empty());
    }
}


function startTimer(duration) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error("Timer element not found!");
        return;
    }

    let remainingTime = duration;

    if (countdown) {
        clearInterval(countdown);
    }

    const updateTimerDisplay = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    updateTimerDisplay();

    countdown = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "Time's Up!";
            alert("Game Over!");
        } else {
            remainingTime--;
            updateTimerDisplay();
        }
    }, 1000);
}


function extractWordsFromGrid() {
    const gridContainer = document.getElementById('gameGrid');
    if (!gridContainer) {
        console.error("Grid container not found!");
        return [];
    }

    const gridItems = Array.from(gridContainer.children);
    let words = [];

    const isEmpty = (cell) => !cell.querySelector('.letter');

    // Extract horizontal words
    for (let row = 0; row < gridWidth; row++) {
        let word = '';
        for (let col = 0; col < gridHeight; col++) {
            const cell = gridItems[row * gridHeight + col];
            const letterElement = cell.querySelector('.letter');
            if (isEmpty(cell)) {
                if (word.length > 1) {
                    words.push(word);
                }
                word = '';
            } else {
                word += letterElement.textContent.trim();
            }
        }
        if (word.length > 1) {
            words.push(word);
        }
    }

    // Extract vertical words
    for (let col = 0; col < gridWidth; col++) {
        let word = '';
        for (let row = 0; row < gridHeight; row++) {
            const cell = gridItems[row * gridHeight + col];
            const letterElement = cell.querySelector('.letter');
            if (isEmpty(cell)) {
                if (word.length > 1) {
                    words.push(word);
                }
                word = '';
            } else {
                word += letterElement.textContent.trim();
            }
        }
        if (word.length > 1) {
            words.push(word);
        }
    }

    return words;
}


async function validateAndUpdateScore() {
    console.log("update and score called")
    const createdWords = extractWordsFromGrid().map(word => word.toLowerCase());
    console.log('Words to validate:', createdWords);

    const response = await fetch('/validate-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: createdWords })
    });

    const validationResult = await response.json();
    console.log('Validation Result:', validationResult);

    if (validationResult.valid) {
        console.log('All words are valid. Updating score...');
        updateScore(createdWords); // Uppdatera poängen endast om alla ord är giltiga
    } else {
        console.log('Some words are invalid:', validationResult.invalidWords);
    }
}


function updateScore(validWords) {
    let totalScore = 0;

    validWords.forEach(word => {
        console.log('Calculating score for word:', word);
        for (const letter of word) {
            const score = getScoreForLetter(letter);
            console.log(`Letter: ${letter}, Score: ${score}`);
            totalScore += score;
        }
    });

    const scoreDisplay = document.getElementById('current-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = totalScore;
        console.log('Updated score:', totalScore);
    } else {
        console.error('Score display element not found!');
    }
}


function getScoreForLetter(letter) {
    const letterScores = {
        'a': 1, 'b': 4, 'c': 10, 'd': 2, 'e': 1, 'f': 4, 'g': 3, 'h': 3, 'i': 1, 'j': 8, 'k': 3, 'l': 2,
        'm': 3, 'n': 1, 'o': 1, 'p': 4, 'q': 10, 'r': 1, 's': 1, 't': 1, 'u': 3, 'v': 4, 'w': 10, 'x': 10,
        'y': 10, 'z': 10, 'å': 7, 'ä': 7, 'ö': 7
    };
    return letterScores[letter.toLowerCase()] || 0;
}

tile.hover(function(){
    $(this).animate({"background-color": "#ffdead"}, {queue: false, duration: 200});
}, function(){
    $(this).animate({"background-color": "#faebd7"}, {queue: false, duration: 200});
});

$(function() {
    tile.draggable();
    $(".grid-item").droppable({
        drop: async function(event, ui) {
            if ($(this).children().length < 1) {
                const clone = $(ui.draggable).clone().appendTo($(this));
                clone.css({"top":"", "left":"", "background-color": "#faebd7", "border": "1px solid"});
                clone.addClass("placed-tile");
            } else {
                $(ui.draggable).animate({"background-color": "#cd5c5c"}, {queue: true, duration: 10});
                $(ui.draggable).animate({"background-color": "#faebd7"}, {queue: true, duration: 500});
            }
            console.log("before call update and score 1")
            await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile placeras
        }
    });
});

$(document).ready(function() {
    $('.grid-item').on('dblclick', async function() {
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove();
            console.log("before call update and  2")
            await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile tas bort
        }
    });
});

tile.mouseup(function() {
    tile.animate({"top":"", "left":""}, {queue: false});
})

// Add event listener for double-click to remove a placed tile
$(document).ready(function() {
    $('.grid-item').on('dblclick', function() {
        // Check if there's a placed tile
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove(); // Remove the placed tile
        }
    });
});
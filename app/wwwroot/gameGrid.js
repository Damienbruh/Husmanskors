let wordlength = 11; //default length of word change later!!
let countdown;
document.addEventListener("DOMContentLoaded", () => {
    createGrid(); // Initialize the grid
    document.getElementById("startGame").addEventListener("click", (event) => {
        startGame(event);
    }); 
});

async function startGame(e) {
    await placeWordInCenter(await testWord(e))
   
    startTimer(180);
}


async function testWord(e, length = wordlength) { 

    e.preventDefault(); // not reload page on form submit
    const response = await fetch(`/new-word?length=${length.toString()}`); // get (read)

    console.log('response', response);

    const startWord = await response.text();

    console.log('startWord: ', startWord);
    return startWord;
}

// function createGrid() {
//     const gridContainer = document.getElementById('gameGrid');
//     if (!gridContainer) {
//         console.error('No grid container found');
//         return;
//     }
//
//
//     for (let i = 0; i < 11 * 11; i++) {
//         const cell = document.createElement('input');
//         cell.type = 'text';
//         cell.maxLength = 1; // Allow one character
//         cell.className = 'grid-item';
//         cell.addEventListener('input', (e) => {
//             e.target.value = e.target.value.toUpperCase();
//         });
//         gridContainer.appendChild(cell);
//     }
//
// }


//todo param width and height to dynamically change based on game settings
function createGrid() {
    const gridContainer = document.getElementById('gameGrid');
    if (!gridContainer) {
        console.error('No grid container found');
        return;
    }

    let gridWidth = 8;
    let gridHeight = 8;
    /*
    sätt css här dynamiskt för .grid-container
    grid-template-columns: repeat(gridWidth, 48px);
    grid-template-rows: repeat(gridHeight, 48px);
     */
    let wordRow = Math.floor(gridHeight/2);
    let wordStartIndex = wordRow * gridWidth; // Word row * columns

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
//TODO refactor for divs instead of input fields
    const gridHeight = 11;  //handle dynamically
    const gridWidth = 11; //handle dynamically
    const startRow = Math.floor(gridHeight / 2); 
    
    const gridCells = $('#gameGrid .grid-item');
    console.log(gridCells);
    const startIndex = startRow * gridWidth;
    for(let i = 0; i < word.length; i++){
        $('#gameGrid  .grid-item').eq(startIndex + i).val(word[i]);
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
    const gridSize = 11; // Assuming grid is 11x11
    let words = [];

    const isEmpty = (cell) => !cell.querySelector('.letter');

    // Extract horizontal words
    for (let row = 0; row < gridSize; row++) {
        let word = '';
        for (let col = 0; col < gridSize; col++) {
            const cell = gridItems[row * gridSize + col];
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
    for (let col = 0; col < gridSize; col++) {
        let word = '';
        for (let row = 0; row < gridSize; row++) {
            const cell = gridItems[row * gridSize + col];
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





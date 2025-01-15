
let wordlength = 11; //default length of word change later!!

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

    const updateTimerDisplay = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `Time Remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const countdown = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "Time's Up!";
            alert("Game Over!");
        } else {
            remainingTime--;
            updateTimerDisplay();
        }
    }, 1000);

    updateTimerDisplay();
}










document.addEventListener("DOMContentLoaded", () => {
    createGrid(); // Initialize the grid
    document.getElementById("startGame").addEventListener("click", startGame); 
});

async function startGame() {
    placeWordInCenter(testWord)
    startTimer(180);
}

async function testWord(e) {

    e.preventDefault(); // not reload page on form submit

    const word = $('[name="word"]').val();

    console.log('word', word);

    const response = await fetch('/new-word' + word); // get (read)

    console.log('response', response);

    const data = await response.json();

    console.log('data', data);

    $('#message').text(word + (data ? ' finns ' : ' finns inte ') + ' i databasen')
}

function createGrid() {
    const gridContainer = document.getElementById('gameGrid');
    if (!gridContainer) {
        console.error('No grid container found');
        return;
    }


    for (let i = 0; i < 11 * 11; i++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = 1; // Allow one character
        cell.className = 'grid-item';
        cell.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        gridContainer.appendChild(cell);
    }

}

function placeWordInCenter(word) {
    const gridContainer = document.getElementById("gameGrid");
    if (!gridContainer) {
        console.error("Grid container not found!");
        return;
    }

    const gridSize = 11; 
    const startRow = Math.floor(gridSize / 2); 
    const startCol = Math.floor((gridSize - word.length) / 2); 

    // Get all grid cells
    const gridItems = gridContainer.querySelectorAll(".grid-item");

    // Place the word horizontally starting from the center
    for (let i = 0; i < word.length; i++) {
        const cellIndex = startRow * gridSize + (startCol + i);
        gridItems[cellIndex].value = word[i]; 
        gridItems[cellIndex].disabled = true; 
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







const createGrid = () => {
    const gridContainer = document.getElementById('grid');

    for (let i = 0; i < 11 * 11; i++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = 1;
        cell.className = 'grid-item'
        cell.addEventListener('input', (e) => {

            e.target.value = e.target.value.toUpperCase();
        });
        gridContainer.appendChild(cell);
    }
};

const startTimer = (duration) => {
    const timerElement = document.getElementById('startTimer');
    let remainingTime = duration;

    const updateTimerDisplay = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `Time Remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;;
    };

    const countdown = setInterval(() => {
        if (remainingTime <=0) {
            clearInterval(countdown);
            timerElement.textContent = "Time's Up!";
            alert("Game Over!");
        }
    }, 1000);

    updateTimerDisplay();
};

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    startTimer(180);
})







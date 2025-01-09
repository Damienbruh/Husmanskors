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

const startTimer = (duration) => {}


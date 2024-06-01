const grid = document.getElementById('grid');
const info = document.getElementById('info');
const resetBtn = document.getElementById('reset-btn');

let targetNumber;
let guessesRemaining = 7;

function generateTarget() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    guessesRemaining = 7;
    updateInfo();
    resetGrid();
}

function createGrid() {
    grid.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = i;
        box.addEventListener('click', () => handleClick(i));
        grid.appendChild(box);
    }
}

function handleClick(clickedNumber) {
    const box = grid.querySelector(`.box:nth-child(${clickedNumber})`);

    if (clickedNumber === targetNumber) {
        box.classList.add('selected');
        info.textContent = 'You found it!';
        disableGrid();
    } else {
        guessesRemaining--;
        updateInfo();
        if (clickedNumber < targetNumber) {
            for (let i = 1; i < clickedNumber; i++) {
                const ruleOutBox = grid.querySelector(`.box:nth-child(${i})`);
                ruleOutBox.classList.add('ruled-out');
            }
        } else {
            for (let i = clickedNumber + 1; i <= 100; i++) {
                const ruleOutBox = grid.querySelector(`.box:nth-child(${i})`);
                ruleOutBox.classList.add('ruled-out');
            }
        }
        if (guessesRemaining === 0) {
            info.textContent = 'You ran out of guesses! The number was ' + targetNumber;
            disableGrid();
        }
        box.classList.add('ruled-out'); 
    }
}

function disableGrid() {
    grid.querySelectorAll('.box').forEach(box => {
        box.removeEventListener('click', handleClick);
    });
}

function resetGame() {
    createGrid();
    generateTarget();
    grid.querySelectorAll('.box').forEach(box => {
        box.classList.remove('selected', 'ruled-out', 'target');
    });
    enableGrid();
}

function resetGrid() {
    grid.querySelectorAll('.box').forEach(box => {
        box.classList.remove('ruled-out');
    });
}

function enableGrid() {
    grid.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', handleClick);
    });
}

function updateInfo() {
    info.textContent = 'Guesses Remaining: ' + guessesRemaining;
}

generateTarget();
createGrid();

resetBtn.addEventListener('click', resetGame);
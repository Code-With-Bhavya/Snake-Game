// Game Constants and Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
const board = document.getElementById('board');
const scoretext = document.getElementById('score');
const highscoretext = document.getElementById('highscore');
let highscore = localStorage.getItem('highscore');
let highscorevalue = 0;
let movedown = true;
let moveup = true;
let moveleft = true;
let moveright = true;

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Check if snake collides with itself or the wall
function isCollide(snake) {
    // Snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Snake collides with walls
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Game engine to update the game state
function gameEngine() {
    musicSound.play();

    // If snake collides, reset the game
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        movedown = true;
        moveup = true;
        moveleft = true;
        moveright = true;
    }

    // If snake eats the food, update the score and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        speed += 0.1;
        if (score > highscorevalue) {
            highscorevalue = score;
            localStorage.setItem("highscore", JSON.stringify(highscorevalue));
            highscoretext.innerHTML = "High Score: " + highscorevalue;
        }
        scoretext.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Initialize high score
try {
    highscorevalue = JSON.parse(highscore);
} catch (e) {
    console.error("Invalid highscore value in localStorage, resetting to 0");
    localStorage.setItem('highscore', JSON.stringify(highscorevalue));
}

highscoretext.innerHTML = "High Score: " + highscorevalue;

// Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (moveup) {
                inputDir.x = 0;
                inputDir.y = -1;
                movedown = false;
                moveright = true;
                moveleft = true;
            }
            break;

        case "ArrowDown":
            if (movedown) {
                inputDir.x = 0;
                inputDir.y = 1;
                moveup = false;
                moveright = true;
                moveleft = true;
            }
            break;

        case "ArrowLeft":
            if (moveleft) {
                inputDir.x = -1;
                inputDir.y = 0;
                moveright = false;
                movedown = true;
                moveup = true;
            }
            break;

        case "ArrowRight":
            if (moveright) {
                inputDir.x = 1;
                inputDir.y = 0;
                moveleft = false;
                movedown = true;
                moveup = true;
            }
            break;

        default:
            break;
    }
});

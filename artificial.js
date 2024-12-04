console.log("Hi there");

const gameBoard = document.getElementById("gameBoard");
console.log(gameBoard);

class Enemy {
    constructor (name, type, speed, image){
        this.name = name;
        this.type = type;
        this.speed = speed;
        this.image = image;
    }
}

const enemyNo1 = new Enemy('Blatherus', 'basic', 3, 'images/Enemy 1.png' );
console.log(enemyNo1);

const slotIncrement = 100;
const slots = [0, slotIncrement, slotIncrement * 2, slotIncrement * 3, slotIncrement * 4, slotIncrement * 5 ];


function spawn(enemy) {
    // pick a slot at random and put the spawn spot there
    const xPosition = slots[Math.floor(Math.random() * slots.length)] + 'px';

    // Create an img element dynamically
    const enemyImg = document.createElement("img");
    enemyImg.src = enemy.image;
    enemyImg.alt = enemy.name;
    enemyImg.style.position = 'absolute';
    enemyImg.style.top = '0px';    
    enemyImg.style.left = xPosition;

    // Append the img to the game board
    gameBoard.appendChild(enemyImg);

    // make the image move downwards
    moveDown(enemyImg, enemy);

};

function moveDown(element, enemy) {
    let yPosition = 0;

    // Move the element down by 5px every 50ms
    const moveInterval = setInterval(() => {
        yPosition += enemy.speed;
        element.style.top = yPosition + 'px';
        const gameBoardHeight = gameBoard.offsetHeight;
        if (yPosition > gameBoardHeight - element.offsetHeight) {
            clearInterval(moveInterval);
            element.remove();
        };
    }, 50);
};


// prevent infinite rendering 
let enemyCount = 0;
const maximumEnemigos = 5;


// spawn a new enemy every so often
const spawnInterval = setInterval (() => {
    if (enemyCount < maximumEnemigos) {

        spawn(enemyNo1);
        enemyCount = enemyCount + 1;
        console.log(`Enemy count: ${enemyCount}`);
    } else {
        // stop spawning once interval is reached
        clearInterval(spawnInterval);
        console.log("Maximum enemigos reached.")
    }
    }, 2000);



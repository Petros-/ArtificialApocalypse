// make sure the connection is set up correctly
// console.log("Hi there");

// create handles for all the things I will need to grab
const gameBoard = document.getElementById("gameBoard");
const pro = document.getElementById('protagonist');
const bull = document.getElementsByClassName('bullet');
const scoreHolder = document.getElementById('score');

// don't start the game until the start button is pressed

// pause the game if the pause button is pressed

// end the game if protagonist dies or if no further enemies exist

// set the score to zero
let score = 0;

// create a class for enemies
class Enemy {

    // set some defaults
    constructor (name, speed = 8, image, strength = 1, bounty = 10){
        this.name = name;

        // used to determine how many pixels to move per increment of time
        this.speed = speed;

        // what image should I use for each type of enemy
        this.image = image;

        // this will be how many shots it takes to kill the enemy
        this.strength = strength;

        // set a bounty on each enemy
        this.bounty = bounty;
    }
}

// author an enemy instance of the class
const enemyNo1 = new Enemy('Blatherus', 8, 'images/Enemy 1.png' );

// make sure it actually exists
// console.log(enemyNo1);

// define how far apart the enemy travel lanes will be and where the first line is
const firstSlot = 20;
const slotIncrement = 100;

// define the slots for where to spawn an enemy
const slots = [
    firstSlot,
    firstSlot + slotIncrement,
    slotIncrement * 2 + slotIncrement,
    slotIncrement * 3 + slotIncrement,
    slotIncrement * 4 + slotIncrement,
    slotIncrement * 5 + slotIncrement 
];

// define what should happen on various keypresses
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {

        // check to see if it's working
        // console.log('A key was pressed');

        // get the current position of the protagonist
        // this value is getting set in two places (css, here)
        // fix it later
        let proLeft = parseInt(pro.style.left) || 200;

        // get boundaries
        const gameBoardWidth = gameBoard.offsetWidth;
        const proWidth = pro.offsetWidth;
        
        // set conditions for what to do for which keys
        switch (event.key) {
            case 'ArrowLeft':
                proLeft -= 20;
                break;
            case 'ArrowRight':
                proLeft += 20;
                break;
            case ' ':
                shoot(pro);
                console.log('shots fired!')
                break;
            default:
                break;
        }
        
        // clamp the values so the protagonist stays on screen
        proLeft = Math.max(0, Math.min(proLeft, gameBoardWidth - proWidth));

        // format the values correctly and apply to the protagonist
        pro.style.left = proLeft + 'px';
    });
});

// create a function to spawn an individual enemy
function spawn(enemy) {

    // pick a slot at random and put the spawn location there
    const xPosition = slots[Math.floor(Math.random() * slots.length)] + 'px';

    // Create an img element dynamically
    const enemyImg = document.createElement("img");
    enemyImg.src = enemy.image;
    enemyImg.alt = enemy.name;
    enemyImg.style.position = 'absolute';
    enemyImg.style.top = '0px';    
    enemyImg.style.left = xPosition;
    enemyImg.classList.add('enemigo');

    // Append the img to the game board
    gameBoard.appendChild(enemyImg);

    // make the image move downwards
    moveDown(enemyImg, enemy);

    // troubleshooting points incrementation
    // console.log(enemy.bounty);

};

// define the downward movement for enemies
function moveDown(element, enemy) {
    let yPosition = 0;

    // Move the element down by some amount every 50ms
    const moveInterval = setInterval(() => {
        yPosition += enemy.speed;
        element.style.top = yPosition + 'px';
        const gameBoardHeight = gameBoard.offsetHeight;
        if (yPosition > gameBoardHeight - element.offsetHeight) {
            clearInterval(moveInterval);
            element.remove();
        }

        // do collision detection
        if (detectCollision(pro, element)) {
            console.log('Collided! with:', enemy.name);
            protagonist.style.backgroundColor = 'red';
            clearInterval(moveInterval);
            element.remove();
        }
    }, 50);
};

// detect collisions
function detectCollision(attacker, attackee) {
    const attackerRect = attacker.getBoundingClientRect();
    const attackeeRect = attackee.getBoundingClientRect();

    // set the functions value to true if the following are false
    return !(

        attackerRect.top > attackeeRect.bottom ||
        attackerRect.bottom < attackeeRect.top ||
        attackerRect.left > attackeeRect.right ||
        attackerRect.right < attackeeRect.left
    );
};

// shoot some things; maybe move this later
function shoot(shooter) {

    // create a projectile
    const projectile = document.createElement('div');

    // create an collection of enemies
    const enemies = document.querySelectorAll('.enemigo');

    // add the bullet class to it
    projectile.classList.add('bullet');

    // generate rectangles from the elements
    const shooterRect = shooter.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();

    // position it just right horizontally and vertically
    projectile.style.left = `${shooterRect.left - gameBoardRect.left + shooterRect.width / 2 - 6}px`;
    projectile.style.bottom = `${gameBoardRect.bottom - shooterRect.top}px`;
    
    // actually put the projectile on the gameboard
    gameBoard.appendChild(projectile);

    // Animate the projectile upwards
    let projectileBottom = parseInt(projectile.style.bottom);
    const moveInterval = setInterval(() => {
        projectileBottom += 10;
        projectile.style.bottom = `${projectileBottom}px`;

        // Remove the projectile if it goes out of bounds
        if (projectileBottom > gameBoard.offsetHeight - 8) {
            clearInterval(moveInterval);
            projectile.remove();
        }
        // do collision detection on all enemies
        enemies.forEach(enemy => {
            if (detectCollision(projectile, enemy)) {
                console.log('Hit:', enemy.alt);

                // increment the score upwards
                score = score + enemy.bounty;
                console.log(enemy.bounty); // this is returning undefined

                projectile.remove();
                enemy.remove();
                clearInterval(moveInterval);
            }
        });
        
    }, 50);
}

// prevent infinite rendering 
let enemyCount = 0;

// put a cap on how many enemies get rendered
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




// control the score from here
scoreHolder.innerText = score + ` pts | Top score: 100,000`;


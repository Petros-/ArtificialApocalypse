// make sure the connection is set up correctly
// console.log("Hi there");

// create handles for all the things I will need to grab
const gameBoard = document.getElementById("gameBoard");
const pro = document.getElementById('protagonist');
const bull = document.getElementsByClassName('bullet');
const scoreHolder = document.getElementById('score');
const beginButton = document.getElementById('begin');
const pauseButton = document.getElementById('pause');
const endButton = document.getElementById('endGame');
const modal = document.getElementById('modal');
const modalContents = document.getElementById('modal-contents');


// don't start the game until the start button is pressed
let gameGo = false;

// create a function to end the game
function endGame() {
    gameGo = false;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // need to write to local storage here
};

// start the game at the press of the button
beginButton.addEventListener('click', function() {

    // close the modal
    modal.classList.add('hidden');
    modal.style.display = 'none';

    // set the game to start
    gameGo = !gameGo;
    
    console.log('Should the game go?' + gameGo);
});

pauseButton.addEventListener('click', function() {

    // pause the game
    gameGo = !gameGo;

     // create a toggle that changes what buttons say and do
     if (gameGo) {

        // resume the game
        endButton.classList.add('hidden');
        pauseButton.textContent = 'Pause';
        
    } else {

        // pause the game
        endButton.classList.remove('hidden');
        pauseButton.textContent = 'Resume';
    }

    // console.log('Game is running? ', gameGo);

});

endButton.addEventListener('click', function() {
    endGame();
    modalContents.innerHTML = `
    <h1>You now report to a robot.</h1>
    <p>Your score: ${score}</p>
    <button id="try-again">Try again</button>
    `;

    const tryAgain = document.getElementById('try-again');
    tryAgain.addEventListener('click', function() {
        enemyCount = 0;
        score = 0;
        gameGo = true;
        // timer would need to be reset too
        modal.classList.add('hidden');
        modal.style.display = 'none';

        // get rid of the existing enemies
        const existingEnemies = document.querySelectorAll('.enemigo');
        existingEnemies.forEach(enemy => enemy.remove());

        // reset the score display
        scoreHolder.textContent = score;
    });

});




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
// here's where to change the enemy speed
const enemyNo1 = new Enemy('Blatherus', 4, 'images/Enemy 1.png' );

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

    // only spawn and move if the game is not paused
    if (gameGo) {

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
        enemyImg.dataset.bounty = enemy.bounty;
        
        
        // Append the img to the game board
        gameBoard.appendChild(enemyImg);
        
        // make the image move downwards
        moveDown(enemyImg, enemy);
    }

};

// define the downward movement for enemies
function moveDown(element, enemy) {
    let yPosition = 0;

    // Move the element down by some amount every 50ms
    const moveInterval = setInterval(() => {
        if (!gameGo) {
            return;
        } else {
            yPosition += enemy.speed;
            element.style.top = yPosition + 'px';
        }

        const gameBoardHeight = gameBoard.offsetHeight;

        // remove the enemy if it goes offscreen
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
                score = score + parseInt(enemy.dataset.bounty);
                // console.log(score);

                // update the score onscreen
                scoreHolder.textContent = score;

                projectile.remove();
                enemy.remove();
                clearInterval(moveInterval);
            }
        });
        
    }, 50);
};

// prevent infinite rendering 
let enemyCount = 0;

// put a cap on how many enemies get rendered
const maximumEnemigos = 5;

// spawn a new enemy every so often
// currently set to every two seconds (2000ms)
const spawnInterval = setInterval (() => {

    // only spawn if there aren't too many enemies already
    // and if the game is not paused
    if (!gameGo) {
        return;

    } else if ((enemyCount < maximumEnemigos) && gameGo){

        // spawn enemies of type enemyNo1
        spawn(enemyNo1);
        enemyCount = enemyCount + 1;
        console.log(`Enemy count: ${enemyCount}`);
    } else {
        
        // stop spawning once interval is reached
        clearInterval(spawnInterval);
        console.log("Maximum enemigos reached.")
    }
}, 2000);









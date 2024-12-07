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
const playerName = document.getElementById('player-name');
const playerNameDisplay = document.getElementById('player-name-display');

// update the name when the field gets changed
playerName.addEventListener('input', function() {
    playerNameDisplay.textContent = playerName.value;
});

// set a default value for player name in the form
playerName.value = 'Player 1';
playerNameDisplay.textContent = playerName.value;

// don't start the game until the start button is pressed
let gameGo = false;

// develop this to use the protagonist getting hit to end the game
let proObject = {
    health: 2
};




// start the game at the press of the button
beginButton.addEventListener('click', function(event) {

    // Prevent form submission (refresh)
    event.preventDefault();

    // close the modal
    modal.classList.add('hidden');

    // set the game to start
    gameGo = !gameGo;

    // start spawning enemies
    startSpawningEnemies();
    
    console.log('Should the game go? ' + gameGo);
    console.log(modal.classList);
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

// define a variable for score and set it to zero
let score = 0;

// create a session object to store game scores locally
class GameSession {
    constructor(nameOfPlayer, gameEndTime, gameEndScore) {
        this.nameOfPlayer = nameOfPlayer;
        this.gameEndTime = gameEndTime;
        this.score = gameEndScore;
    }
};

// define the contents of the end game modal
const endGameModalText = `
    <h1>You now report to a robot.</h1>
    
    <button id="try-again">Try again</button>
    `;

    // <p>Your score: ${score}</p>

// create a function to end the game
function endGame() {
    
    // stop the game
    gameGo = false;

    // change what the modal says
    modalContents.innerHTML = endGameModalText;

    // open the dialog
    modal.classList.remove('hidden');

    console.log('The game ended.');

    // get the current time
    const now = new Date();
    const nowPrettier = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    // construct a game record of a single game
    const gameRecord = new GameSession(playerName.value, nowPrettier, score);

    // initialize the games list variable
    let gamesList;
    
    // if local storage has something in it
    // then get the item and append to it
    if (localStorage.length > 0) {

        // local storage has items
        // so get the items and parse the JSON into an object
        gamesList = JSON.parse(localStorage.getItem('Games played'));

        // then push the game record you just created above into that list
        gamesList.push(gameRecord);

        // and update local storage with the new array
        localStorage.setItem('Games played', JSON.stringify(gamesList));

    } else {

        // local storage is empty
        // so create a new array
        gamesList = [];

        // and push the new game record into it
        gamesList.push(gameRecord);

        // and update local storage with the new array
        localStorage.setItem('Games played', JSON.stringify(gamesList));
    }
   
    console.log(gamesList);

};

endButton.addEventListener('click', function() {
    endGame();

    // change what the modal says
    modalContents.innerHTML = endGameModalText;


    // grab the try again button
    const tryAgain = document.getElementById('try-again');

    // what to do if try again gets clicked
    tryAgain.addEventListener('click', function() {
        enemyCount = 0;
        score = 0;
        gameGo = true;
        // timer would need to be reset too

        // put away the modal
        modal.classList.add('hidden');

        // change the buttons back
        endButton.classList.add('hidden');
        pauseButton.textContent = 'Pause';

        // get rid of the existing enemies
        const existingEnemies = document.querySelectorAll('.enemigo');
        existingEnemies.forEach(enemy => enemy.remove());

        // reset the score display
        scoreHolder.textContent = score;

        // start spawning enemies again
        startSpawningEnemies();
        
    });

});

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
            console.log('Collided! with enemy type:', enemy.name);
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

// create a controller or id for managing overall spawning
let spawnIntervalId;

// spawn a new enemy every so often
// currently set to every two seconds (2000ms)
function startSpawningEnemies() {

    // clear existing interval
    if (spawnIntervalId) {
        clearInterval(spawnIntervalId);
    }

    spawnIntervalId = setInterval (() => {

        // only spawn if there aren't too many enemies already
        // and if the game is not paused
        if (!gameGo) {
            return;
        }

        if (enemyCount < maximumEnemigos){
    
            // spawn enemies of type enemyNo1
            spawn(enemyNo1);
            enemyCount++;
            console.log(`Enemy count: ${enemyCount}`);
        } 

        // if there are no more enemies end the game with a delay
        if (enemyCount === maximumEnemigos) {

            // stop spawning more enemies
            clearInterval(spawnIntervalId);
            console.log('Maximum enemigos reached. Ending game shortly...')
            
            // check every two seconds to see if all enemies are gone
            const checkForClearEnemies = setInterval(() => {
                if(document.querySelectorAll('.enemigo').length === 0 && gameGo) {

                    // end the checking
                    clearInterval(checkForClearEnemies);

                    // end the game
                    endGame();
                    console.log('Game ended because enemies were exhausted.')
                }
            }, 2000);
        }
    }, 2000);
};



// if the protagonist health reaches zero end the game
if (proObject.health === 0) {
    endGame();
}


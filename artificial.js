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
const modalBlock = document.getElementById('modal-contents');
const playerName = document.getElementById('player-name');
const playerNameDisplay = document.getElementById('player-name-display');
const topScoreHandle = document.getElementById('top-score');

// store some sounds
const thud = new Audio('sounds/Thud.m4a');
const ding = new Audio('sounds/GlassDing.m4a');
const paperCrush = new Audio('sounds/PaperWaste.m4a');
const flutter = new Audio('sounds/Flutter.m4a');

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

// verify that there is a player name
const validatePlayerName = (name) => {
    const errElement = name.nextElementSibling;
    const regex = /^(?! +$).+$/;
    if (regex.test(name.value.trim())) {
        name.parentElement.classList.remove('invalid');
        errElement.classList.add('hidden');
        return true;
    } else {
        name.parentElement.classList.add('invalid');
        errElement.classList.remove('hidden');
        return false;
    }
    
};

// start the game at the press of the button
beginButton.addEventListener('click', function(event) {

    // Prevent form submission (refresh)
    event.preventDefault();

    // prevent protagonist jumping
    pro.style.left = "400px";

    if (validatePlayerName(playerName)) {

        // close the modal
        modal.classList.add('hidden');
    
        // set the game to start
        gameGo = !gameGo;
    
        // start spawning enemies
        startSpawningEnemies();
        
        console.log('Should the game go? ' + gameGo);
        console.log(modal.classList);
    } else {
        alert('Please enter a valid player name including any characters you want. Just don\'t leave it blank');
    }
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

// try to make this key press thing smoother with request animation frame
// create an empty object to track any active key presses
const keysPressed = {};

// Listen for key presses
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
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

const modalContents = [
    `
    <h1>You now report to a robot.</h1>
    <p class="bullet-text">You failed to fend off the robots, and now
    they\'ve taken your job.</p>
    <button id="try-again">Try again</button>
    `,
    `
    <h1>You did it.</h1>
    <p class="bullet-text">You won. You beat the game. This calls for celebration.</p>
    <button id="try-again">Play again</button>
    `,
    `
    <h1>You left?</h1>
    <p class="bullet-text"> Sad to see you go, but if you want to play again, 
    we'll be here.
    </p>
    <button id="try-again">Play again</button>
    `

];

// <p>Your score: ${score}</p>

// set a variable for the top score
let topScore;

// what to do at the ending of the game
function endGame() {
    
    // stop the game
    gameGo = false;
    setModalContent(modalContents[0]);

    // open the dialog
    modal.classList.remove('hidden');
    console.log('The game ended.');

    updateGameRecords();

};

// // grab the try again button
// const tryAgain = document.getElementById('try-again');

// // what to do if try again gets clicked
// tryAgain.addEventListener('click', function() {
//     enemyCount = 0;
//     score = 0;
//     gameGo = true;
    
//     // prevent protagonist jumping
//     pro.style.left = "400px";

//     // put away the modal
//     modal.classList.add('hidden');

//     // change the buttons back
//     endButton.classList.add('hidden');
//     pauseButton.textContent = 'Pause';

//     // get rid of the existing enemies
//     const existingEnemies = document.querySelectorAll('.enemigo');
//     existingEnemies.forEach(enemy => enemy.remove());

//     // reset the score display
//     scoreHolder.textContent = score;

//     // start spawning enemies again
//     startSpawningEnemies();
    
// });

function updateGameRecords() {
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

    // update the top score
    if (gamesList.length > 0) {
        topScore = gamesList.reduce((max, record) => {
            return (record.score > max.score) ? record : max;
        });
        topScoreHandle.textContent = `Top score: ${top-score}`;
    } else {
        topScoreHandle.textContent = 'Top score: TBD';
    }
   
    console.log(gamesList);
};

function setModalContent(content) {
    modalBlock.innerHTML = content;

    // attach the try again button listener dynamically
    const tryAgain = document.getElementById('try-again');
    
    if (tryAgain) {

        // call restart game directly
        tryAgain.addEventListener('click', restartGame);
    
    }
};


// new function added Dec 8
function restartGame() {
    // reset stuff including protagonist health
    proObject.health = 2;
    pro.style.left = '400px';
    enemyCount = 0;
    score = 0;
    gameGo = true;

    // reset protagonist's position
    pro.style.left = '400px';

    // hide the modal
    modal.classList.add('hidden');

    // reset buttons and display
    endButton.classList.add('hidden');
    pauseButton.textContent = 'Pause';

    // remove existing enemies
    const existingEnemies = document.querySelectorAll('.enemigo');
    existingEnemies.forEach(enemy => enemy.remove());

    // reset the score display
    scoreHolder.textContent = score;

    // start spawning enemies
    startSpawningEnemies();
}


endButton.addEventListener('click', function() {
    endGame();

    // change what the modal says
    setModalContent(modalContents[2]);
    modal.classList.add('hidden');

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

// how many pixels per frame to move objects
const movementSpeed = 5;

function moveProtagonist () {

    // get the current position of the protagonist
    // this value is getting set in two places (css, here)
    // fix it later
    let proLeft = parseInt(pro.style.left) || 0;

    // get boundaries
    const gameBoardWidth = gameBoard.offsetWidth;
    const proWidth = pro.offsetWidth;

    // move left
    if (keysPressed['ArrowLeft']) {
        proLeft -= movementSpeed;
    }

    // move right
    if (keysPressed['ArrowRight']) {
        proLeft += movementSpeed;
    }

    // clamp the values so the protagonist stays on screen
    proLeft = Math.max(0, Math.min(proLeft, gameBoardWidth - proWidth));

    // format the values correctly and apply to the protagonist
    pro.style.left = `${proLeft}px`;

    // Continue the loop
    requestAnimationFrame(moveProtagonist);
};

moveProtagonist();

// old
// define what should happen on various keypresses
document.addEventListener('keydown', (event) => {
    
    // set conditions for what to do for which keys
    switch (event.key) {
        case ' ':
            shoot(pro);
            console.log('shots fired!')
            break;
        default:
            break;
    }
    
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
            // enemyCount--; 
        }

        // do collision detection
        if (detectCollision(pro, element)) {
            console.log('Collided! with enemy type:', enemy.name);
            protagonist.style.backgroundColor = 'red';
            thud.play();
            clearInterval(moveInterval);
            element.remove();
            // enemyCount--; 
            proObject.health = proObject.health - 1;
            console.log('Protagonist health: ', proObject.health);
        };
        
        // if the protagonist health reaches zero end the game
        if (proObject.health === 0 || document.querySelectorAll('.enemigo').length === 0) {
            endGame()
        };
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

                ding.play();
                paperCrush.play();

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
            gameGo = false;
            console.log('Maximum enemigos reached. Ending game shortly...')
            
            // check every two seconds to see if all enemies are gone
            const checkForClearEnemies = setInterval(() => {
                if(document.querySelectorAll('.enemigo').length === 0 && gameGo) {

                    // end the checking
                    clearInterval(checkForClearEnemies);

                    // end the game
                    endGame();

                    // change what the modal says
                    modalBlock.innerHTML = modalContents[1];

                    console.log('Game ended because enemies were exhausted.')
                }
            }, 2000);
        }
    }, 2000);
};
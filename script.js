// ==========================================
// CALL TO DUTY — CTD
// OPERATION ONE
// PHASE 1 GAME LOGIC
// ==========================================


// ================================
// GAME VARIABLES
// ================================

let score = 0;
let health = 100;

let enemyHealth = 100;

let ammo = 12;
let maxAmmo = 12;

let gameRunning = false;

let enemyX = 50;
let enemyY = 35;


// ================================
// GET HTML ELEMENTS
// ================================

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const gameOver = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

const scoreDisplay = document.getElementById("score");
const healthDisplay = document.getElementById("health");

const enemy = document.getElementById("enemy");

const fireButton = document.getElementById("fireButton");
const reloadButton = document.getElementById("reloadButton");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

const weapon = document.getElementById("weapon");


// ================================
// START GAME
// ================================

startButton.addEventListener("click", startGame);

function startGame() {

    score = 0;
    health = 100;
    enemyHealth = 100;

    ammo = maxAmmo;

    gameRunning = true;

    scoreDisplay.textContent = score;
    healthDisplay.textContent = health;

    startScreen.classList.add("hidden");
    gameOver.classList.add("hidden");

    moveEnemy();
}


// ================================
// RESTART GAME
// ================================

restartButton.addEventListener("click", startGame);


// ================================
// FIRE WEAPON
// ================================

fireButton.addEventListener("touchstart", fireWeapon);
fireButton.addEventListener("mousedown", fireWeapon);

function fireWeapon(event) {

    event.preventDefault();

    if (!gameRunning) {
        return;
    }

    if (ammo <= 0) {

        showMessage("RELOAD");

        return;
    }

    ammo--;

    // Weapon recoil
    weapon.style.transform =
        "translateX(-50%) translateY(8px) rotate(-3deg)";

    setTimeout(() => {

        weapon.style.transform =
            "translateX(-50%)";

    }, 100);


    // Check if enemy is close enough to crosshair
    const hit = checkEnemyHit();

    if (hit) {

        enemyHealth -= 25;

        enemy.style.transform =
            "translateX(-50%) scale(0.92)";

        setTimeout(() => {

            enemy.style.transform =
                "translateX(-50%) scale(1)";

        }, 100);


        if (enemyHealth <= 0) {

            enemyDefeated();

        } else {

            showMessage("HIT!");

        }

    } else {

        showMessage("MISS");

    }
}


// ================================
// CHECK ENEMY HIT
// ================================

function checkEnemyHit() {

    const battlefield =
        document.getElementById("battlefield");

    const battlefieldRect =
        battlefield.getBoundingClientRect();

    const enemyRect =
        enemy.getBoundingClientRect();


    const crosshairX =
        battlefieldRect.left +
        battlefieldRect.width / 2;

    const crosshairY =
        battlefieldRect.top +
        battlefieldRect.height / 2;


    return (
        crosshairX >= enemyRect.left &&
        crosshairX <= enemyRect.right &&
        crosshairY >= enemyRect.top &&
        crosshairY <= enemyRect.bottom
    );
}


// ================================
// ENEMY DEFEATED
// ================================

function enemyDefeated() {

    score += 100;

    scoreDisplay.textContent = score;

    enemy.style.opacity = "0";

    showMessage("+100");

    setTimeout(() => {

        enemyHealth = 100;

        enemy.style.opacity = "1";

        moveEnemy();

    }, 700);
}


// ================================
// MOVE ENEMY
// ================================

function moveEnemy() {

    if (!gameRunning) {
        return;
    }

    enemyX =
        Math.floor(Math.random() * 70) + 15;

    enemyY =
        Math.floor(Math.random() * 25) + 25;


    enemy.style.left =
        enemyX + "%";

    enemy.style.top =
        enemyY + "%";

}


// ================================
// RELOAD
// ================================

reloadButton.addEventListener("click", reloadWeapon);

function reloadWeapon() {

    if (!gameRunning) {
        return;
    }

    if (ammo === maxAmmo) {

        showMessage("FULL");

        return;
    }

    showMessage("RELOADING...");

    reloadButton.disabled = true;

    setTimeout(() => {

        ammo = maxAmmo;

        reloadButton.disabled = false;

        showMessage("READY");

    }, 1000);
}


// ================================
// PLAYER DAMAGE
// ================================

function damagePlayer(amount) {

    if (!gameRunning) {
        return;
    }

    health -= amount;

    if (health < 0) {
        health = 0;
    }

    healthDisplay.textContent = health;


    if (health <= 0) {

        endGame();

    }
}


// ================================
// GAME OVER
// ================================

function endGame() {

    gameRunning = false;

    document.getElementById("finalScore").textContent =
        score;

    gameOver.classList.remove("hidden");
}


// ================================
// MESSAGE SYSTEM
// ================================

function showMessage(message) {

    const messageBox =
        document.createElement("div");

    messageBox.textContent = message;

    messageBox.style.position = "absolute";
    messageBox.style.left = "50%";
    messageBox.style.top = "40%";

    messageBox.style.transform =
        "translate(-50%, -50%)";

    messageBox.style.fontSize = "22px";
    messageBox.style.fontWeight = "bold";

    messageBox.style.color = "white";

    messageBox.style.textShadow =
        "0 2px 5px black";

    messageBox.style.zIndex = "200";

    document.getElementById("battlefield")
        .appendChild(messageBox);


    setTimeout(() => {

        messageBox.remove();

    }, 600);
}


// ================================
// MOBILE JOYSTICK
// ================================

let joystickActive = false;

joystick.addEventListener(
    "touchstart",
    startJoystick,
    { passive: false }
);

joystick.addEventListener(
    "touchmove",
    moveJoystick,
    { passive: false }
);

joystick.addEventListener(
    "touchend",
    stopJoystick
);


function startJoystick(event) {

    event.preventDefault();

    if (!gameRunning) {
        return;
    }

    joystickActive = true;

    moveJoystick(event);
}


function moveJoystick(event) {

    event.preventDefault();

    if (!joystickActive) {
        return;
    }

    const touch = event.touches[0];

    const rect =
        joystick.getBoundingClientRect();


    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;


    let x =
        touch.clientX - centerX;

    let y =
        touch.clientY - centerY;


    const distance =
        Math.sqrt(x * x + y * y);

    const maxDistance =
        rect.width / 2 - 27;


    if (distance > maxDistance) {

        x =
            x / distance * maxDistance;

        y =
            y / distance * maxDistance;

    }


    joystickKnob.style.transform =
        `translate(calc(-50% + ${x}px),
                   calc(-50% + ${y}px))`;


    // Move battlefield slightly
    // to simulate player movement

    const movementX =
        x / maxDistance * 2;

    const movementY =
        y / maxDistance * 1.5;


    enemy.style.marginLeft =
        movementX * -20 + "px";

    enemy.style.marginTop =
        movementY * -10 + "px";
}


function stopJoystick() {

    joystickActive = false;

    joystickKnob.style.transform =
        "translate(-50%, -50%)";

    enemy.style.marginLeft = "0";
    enemy.style.marginTop = "0";
}


// ================================
// KEYBOARD SUPPORT
// ================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }

        if (event.code === "Space") {

            fireWeapon(event);

        }

        if (
            event.key.toLowerCase() === "r"
        ) {

            reloadWeapon();

        }

    }
);


// ================================
// PREVENT MOBILE ZOOM
// ================================

document.addEventListener(
    "gesturestart",
    function(event) {

        event.preventDefault();

    }
);

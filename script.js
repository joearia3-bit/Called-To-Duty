// ==========================================
// CALL TO DUTY — CTD
// OPERATION ONE
// PHASE 2
// MOBILE FPS CONTROLS
// ==========================================


// ==========================================
// GAME VARIABLES
// ==========================================

let score = 0;
let health = 100;

let enemyHealth = 100;

let ammo = 12;
const maxAmmo = 12;

let gameRunning = false;

let joystickActive = false;
let aimActive = false;

let aimX = 0;
let aimY = 0;

let playerX = 0;
let playerY = 0;

let enemyX = 50;
let enemyY = 34;

let damageTimer = null;


// ==========================================
// HTML ELEMENTS
// ==========================================

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const gameOver =
    document.getElementById("gameOver");

const restartButton =
    document.getElementById("restartButton");

const scoreDisplay =
    document.getElementById("score");

const healthDisplay =
    document.getElementById("health");

const ammoDisplay =
    document.getElementById("ammo");

const maxAmmoDisplay =
    document.getElementById("maxAmmo");

const enemy =
    document.getElementById("enemy");

const fireButton =
    document.getElementById("fireButton");

const reloadButton =
    document.getElementById("reloadButton");

const weapon =
    document.getElementById("weapon");

const battlefield =
    document.getElementById("battlefield");

const targetArea =
    document.getElementById("targetArea");

const crosshair =
    document.getElementById("crosshair");

const joystick =
    document.getElementById("joystick");

const joystickKnob =
    document.getElementById("joystick-knob");

const aimArea =
    document.getElementById("aimArea");

const statusMessage =
    document.getElementById("statusMessage");

const finalScore =
    document.getElementById("finalScore");


// ==========================================
// INITIAL DISPLAY
// ==========================================

maxAmmoDisplay.textContent = maxAmmo;
ammoDisplay.textContent = ammo;


// ==========================================
// START GAME
// ==========================================

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    score = 0;
    health = 100;
    enemyHealth = 100;

    ammo = maxAmmo;

    playerX = 0;
    playerY = 0;

    aimX = 0;
    aimY = 0;

    gameRunning = true;

    scoreDisplay.textContent = score;
    healthDisplay.textContent = health;
    ammoDisplay.textContent = ammo;

    startScreen.classList.add("hidden");
    gameOver.classList.add("hidden");

    resetCamera();

    moveEnemy();

    startEnemyAttack();

    showMessage("MISSION START");
}


// ==========================================
// RESET CAMERA
// ==========================================

function resetCamera() {

    targetArea.style.transform =
        "translate(0px, 0px)";

    crosshair.style.transform =
        "translate(-50%, -50%)";

    weapon.style.transform =
        "translateX(-50%)";
}


// ==========================================
// FIRE
// ==========================================

fireButton.addEventListener(
    "touchstart",
    fireWeapon,
    { passive: false }
);

fireButton.addEventListener(
    "mousedown",
    fireWeapon
);


function fireWeapon(event) {

    if (event) {
        event.preventDefault();
    }

    if (!gameRunning) {
        return;
    }

    if (ammo <= 0) {

        showMessage("RELOAD");

        return;
    }

    ammo--;

    ammoDisplay.textContent = ammo;


    // --------------------------------------
    // WEAPON RECOIL
    // --------------------------------------

    weapon.style.transform =
        "translateX(-50%) translateY(10px) rotate(-4deg)";

    crosshair.style.transform =
        "translate(-50%, -50%) scale(1.15)";


    setTimeout(() => {

        weapon.style.transform =
            "translateX(-50%)";

        crosshair.style.transform =
            "translate(-50%, -50%)";

    }, 100);


    // --------------------------------------
    // HIT DETECTION
    // --------------------------------------

    if (checkEnemyHit()) {

        enemyHealth -= 25;

        showMessage("HIT!");

        enemy.style.transform =
            "translateX(-50%) scale(0.9)";

        setTimeout(() => {

            enemy.style.transform =
                "translateX(-50%) scale(1)";

        }, 100);


        if (enemyHealth <= 0) {

            enemyDefeated();

        }

    } else {

        showMessage("MISS");

    }
}


// ==========================================
// CHECK ENEMY HIT
// ==========================================

function checkEnemyHit() {

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


// ==========================================
// ENEMY DEFEATED
// ==========================================

function enemyDefeated() {

    score += 100;

    scoreDisplay.textContent = score;

    enemy.style.opacity = "0";

    showMessage("+100");


    setTimeout(() => {

        if (!gameRunning) {
            return;
        }

        enemyHealth = 100;

        enemy.style.opacity = "1";

        moveEnemy();

    }, 700);
}


// ==========================================
// MOVE ENEMY
// ==========================================

function moveEnemy() {

    if (!gameRunning) {
        return;
    }


    enemyX =
        Math.floor(
            Math.random() * 70
        ) + 15;


    enemyY =
        Math.floor(
            Math.random() * 30
        ) + 25;


    enemy.style.left =
        enemyX + "%";

    enemy.style.top =
        enemyY + "%";
}


// ==========================================
// RELOAD
// ==========================================

reloadButton.addEventListener(
    "click",
    reloadWeapon
);


function reloadWeapon() {

    if (!gameRunning) {
        return;
    }

    if (ammo === maxAmmo) {

        showMessage("FULL");

        return;
    }


    reloadButton.disabled = true;

    showMessage("RELOADING");


    setTimeout(() => {

        ammo = maxAmmo;

        ammoDisplay.textContent = ammo;

        reloadButton.disabled = false;

        showMessage("READY");

    }, 1000);
}


// ==========================================
// JOYSTICK START
// ==========================================

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


// ==========================================
// JOYSTICK MOVEMENT
// ==========================================

function moveJoystick(event) {

    event.preventDefault();

    if (!joystickActive) {
        return;
    }


    const touch =
        event.touches[0];

    const rect =
        joystick.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    let x =
        touch.clientX - centerX;

    let y =
        touch.clientY - centerY;


    const distance =
        Math.sqrt(
            x * x +
            y * y
        );


    const maxDistance =
        rect.width / 2 - 29;


    if (distance > maxDistance) {

        x =
            x / distance *
            maxDistance;

        y =
            y / distance *
            maxDistance;
    }


    joystickKnob.style.transform =
        `translate(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px)
        )`;


    // --------------------------------------
    // MOVE CAMERA / WORLD
    // --------------------------------------

    playerX =
        x / maxDistance;

    playerY =
        y / maxDistance;


    const moveX =
        playerX * 30;

    const moveY =
        playerY * 15;


    targetArea.style.transform =
        `translate(
            ${moveX}px,
            ${moveY}px
        )`;
}


// ==========================================
// STOP JOYSTICK
// ==========================================

function stopJoystick() {

    joystickActive = false;

    joystickKnob.style.transform =
        "translate(-50%, -50%)";

    playerX = 0;
    playerY = 0;
}


// ==========================================
// AIM TOUCH CONTROLS
// ==========================================

aimArea.addEventListener(
    "touchstart",
    startAim,
    { passive: false }
);


aimArea.addEventListener(
    "touchmove",
    moveAim,
    { passive: false }
);


aimArea.addEventListener(
    "touchend",
    stopAim
);


function startAim(event) {

    event.preventDefault();

    if (!gameRunning) {
        return;
    }

    aimActive = true;

    moveAim(event);
}


function moveAim(event) {

    event.preventDefault();

    if (!aimActive) {
        return;
    }


    const touch =
        event.touches[0];


    const rect =
        aimArea.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    const differenceX =
        touch.clientX -
        centerX;

    const differenceY =
        touch.clientY -
        centerY;


    aimX += differenceX * 0.035;

    aimY += differenceY * 0.025;


    // Keep aiming controlled

    aimX =
        Math.max(
            -120,
            Math.min(120, aimX)
        );


    aimY =
        Math.max(
            -70,
            Math.min(70, aimY)
        );


    targetArea.style.transform =
        `translate(
            ${-aimX}px,
            ${-aimY}px
        )`;
}


function stopAim() {

    aimActive = false;
}


// ==========================================
// ENEMY ATTACK
// ==========================================

function startEnemyAttack() {

    if (damageTimer) {

        clearInterval(damageTimer);

    }


    damageTimer =
        setInterval(() => {

            if (!gameRunning) {
                return;
            }


            const distance =
                Math.abs(
                    enemyX - 50
                );


            if (distance < 25) {

                damagePlayer(10);

            }

        }, 3000);
}


// ==========================================
// PLAYER DAMAGE
// ==========================================

function damagePlayer(amount) {

    if (!gameRunning) {
        return;
    }


    health -= amount;


    if (health < 0) {

        health = 0;

    }


    healthDisplay.textContent =
        health;


    battlefield.style.filter =
        "brightness(0.65)";


    setTimeout(() => {

        battlefield.style.filter =
            "brightness(1)";

    }, 150);


    showMessage(
        "-" + amount + " HP"
    );


    if (health <= 0) {

        endGame();

    }
}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning = false;


    if (damageTimer) {

        clearInterval(damageTimer);

        damageTimer = null;

    }


    finalScore.textContent =
        score;


    gameOver.classList.remove(
        "hidden"
    );
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    statusMessage.textContent =
        message;


    statusMessage.style.opacity =
        "1";


    setTimeout(() => {

        statusMessage.style.opacity =
            "0";

    }, 600);
}


// ==========================================
// KEYBOARD SUPPORT
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }


        if (
            event.code === "Space"
        ) {

            fireWeapon(event);

        }


        if (
            event.key.toLowerCase()
            === "r"
        ) {

            reloadWeapon();

        }

    }
);


// ==========================================
// PREVENT MOBILE GESTURES
// ==========================================

document.addEventListener(
    "gesturestart",
    function(event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "dblclick",
    function(event) {

        event.preventDefault();

    }
);
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

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// Set up canvas dimensions
canvas.width = 600;
canvas.height = 400;

// Game variables
let score = 0;
let shooter = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30 };
let bullets = [];
let targets = [];
let isGameActive = true;
let targetSpeed = 2;
const bulletSpeed = 5;
const targetWidth = 40;
const targetHeight = 40;

// Initialize targets
function createTargets() {
    for (let i = 0; i < 5; i++) {
        targets.push({
            x: i * (targetWidth + 20) + 20,
            y: 50,
            width: targetWidth,
            height: targetHeight,
            isHit: false
        });
    }
}

// Game loop
function gameLoop() {
    if (!isGameActive) return;

    clearCanvas();
    drawShooter();
    moveBullets();
    drawBullets();
    drawTargets();
    moveTargets();
    checkCollisions();
    removeHitTargets();

    requestAnimationFrame(gameLoop);
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw the shooter
function drawShooter() {
    ctx.fillStyle = '#ff5f6d';
    ctx.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
}

// Move the shooter with arrow keys
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && shooter.x > 0) {
        shooter.x -= 10;
    } else if (event.key === 'ArrowRight' && shooter.x < canvas.width - shooter.width) {
        shooter.x += 10;
    }
});

// Draw and move bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = '#ffdd00';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

// Shoot bullets when space is pressed
document.addEventListener('keydown', event => {
    if (event.key === ' ') {
        bullets.push({ x: shooter.x + shooter.width / 2 - 2.5, y: shooter.y });
    }
});

// Move bullets
function moveBullets() {
    bullets.forEach(bullet => bullet.y -= bulletSpeed);
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// Draw targets
function drawTargets() {
    targets.forEach(target => {
        if (!target.isHit) {
            ctx.fillStyle = '#ffc371';
            ctx.fillRect(target.x, target.y, target.width, target.height);
        }
    });
}

// Move targets
function moveTargets() {
    targets.forEach(target => target.y += targetSpeed);
    // Check if any target hits the bottom
    if (targets.some(target => target.y + target.height > canvas.height)) {
        isGameActive = false;
        alert('Game Over! A target hit the bottom.');
    }
}

// Check for bullet-target collisions
function checkCollisions() {
    bullets.forEach(bullet => {
        targets.forEach(target => {
            if (!target.isHit &&
                bullet.x < target.x + target.width &&
                bullet.x + 5 > target.x &&
                bullet.y < target.y + target.height &&
                bullet.y + 10 > target.y) {
                target.isHit = true;
                score += 10;
                scoreText.textContent = `Score: ${score}`;
            }
        });
    });
}

// Remove hit targets and generate new ones
function removeHitTargets() {
    if (targets.every(target => target.isHit)) {
        createTargets();
    }
}

// Restart the game
restartBtn.addEventListener('click', () => {
    score = 0;
    scoreText.textContent = `Score: ${score}`;
    shooter.x = canvas.width / 2 - 15;
    bullets = [];
    targets = [];
    isGameActive = true;
    createTargets();
    gameLoop();
});

// Start the game
createTargets();
gameLoop();

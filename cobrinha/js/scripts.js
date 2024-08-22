const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20; // Tamanho de cada bloco
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake = [{ x: 2 * scale, y: 2 * scale }];
let food = generateFood(); // Gera a comida inicial
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let score = 0;
let lastRenderTime = 0;
const speed = 5; // Velocidade da cobrinha em blocos por segundo
const frameRate = 60; // Taxa de frames por segundo
const interval = 3000 / frameRate; // Intervalo entre frames em milissegundos
let timeSinceLastMove = 0;
const radius = scale / 2; // Raio dos segmentos da cobra

// Controle da direção
document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case 37: // Esquerda
            if (direction !== 'RIGHT') newDirection = 'LEFT';
            break;
        case 38: // Cima
            if (direction !== 'DOWN') newDirection = 'UP';
            break;
        case 39: // Direita
            if (direction !== 'LEFT') newDirection = 'RIGHT';
            break;
        case 40: // Baixo
            if (direction !== 'UP') newDirection = 'DOWN';
            break;
    }
});

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * columns) * scale;
        y = Math.floor(Math.random() * rows) * scale;
    } while (isFoodOnSnake(x, y)); // Garante que a comida não apareça na cobra
    return { x, y };
}

function isFoodOnSnake(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

function updateGame(deltaTime) {
    timeSinceLastMove += deltaTime;

    // Atualiza a cobra a cada frame baseado na velocidade
    if (timeSinceLastMove >= interval) {
        direction = newDirection;

        // Move a cobra
        let head = { ...snake[0] };
        switch (direction) {
            case 'LEFT':
                head.x -= scale;
                break;
            case 'UP':
                head.y -= scale;
                break;
            case 'RIGHT':
                head.x += scale;
                break;
            case 'DOWN':
                head.y += scale;
                break;
        }

        // Verifica colisão com as paredes
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            resetGame();
            return;
        }

        // Verifica colisão com a própria cobra
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            resetGame();
            return;
        }

        // Adiciona a nova cabeça da cobra
        snake.unshift(head);

        // Verifica se a cobra comeu a comida
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = generateFood(); // Gera nova comida
        } else {
            snake.pop(); // Remove o último segmento
        }

        timeSinceLastMove = 0; // Reseta o tempo desde o último movimento
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobra
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.beginPath();
        ctx.arc(segment.x + radius, segment.y + radius, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenha a comida
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + radius, food.y + radius, radius, 0, Math.PI * 2);
    ctx.fill();

    // Atualiza o escore
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function resetGame() {
    snake = [{ x: 2 * scale, y: 2 * scale }];
    direction = 'RIGHT';
    newDirection = 'RIGHT';
    score = 0;
    food = generateFood(); // Gera a comida inicial
}

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastRenderTime;

    updateGame(deltaTime);
    draw();

    lastRenderTime = currentTime;
    requestAnimationFrame(gameLoop);
}

function startGame() {
    lastRenderTime = 0;
    timeSinceLastMove = 0;
    requestAnimationFrame(gameLoop);
}

startGame();

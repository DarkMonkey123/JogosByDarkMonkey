document.addEventListener('DOMContentLoaded', () => {
    const dino = document.getElementById('dino');
    const gameArea = document.getElementById('gameArea');
    let score = 0; // Pontuação inicial
    let isJumping = false;
    let gameOver = false;
    let cactusInterval = 3000; // Intervalo inicial para criar cactos
    let cactusCount = 0; // Contador de cactos

    function createCactus() {
        // Gera um número aleatório de cactos entre 1 e 3
        const numberOfCactuses = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numberOfCactuses; i++) {
            const cactus = document.createElement('div');
            cactus.className = 'cactus';
            cactus.style.left = `${gameArea.offsetWidth}px`; // Começa fora da tela à direita
            cactus.style.bottom = '20px'; // Ajusta a posição para estar na mesma linha do dino
            gameArea.appendChild(cactus);
            moveCactus(cactus);
        }
    }

    function moveCactus(cactus) {
        let cactusPosition = gameArea.offsetWidth;
        const moveSpeed = 5; // Velocidade do cacto

        function move() {
            if (gameOver) return;
            cactusPosition -= moveSpeed; // Atualiza a posição do cacto
            cactus.style.left = `${cactusPosition}px`;

            if (cactusPosition < -30) { // Se o cacto sair da tela
                gameArea.removeChild(cactus);
                if (!gameOver) {
                    score += 10; // Aumenta a pontuação
                    document.getElementById('score').textContent = `Pontuação: ${score}`;
                }
            }

            checkCollision(cactus);
            requestAnimationFrame(move); // Solicita o próximo quadro de animação
        }
        move();
    }

    function jump() {
        if (isJumping || gameOver) return;
        isJumping = true;
        dino.classList.add('jump'); // Adiciona a classe de salto

        setTimeout(() => {
            dino.classList.remove('jump'); // Remove a classe após o salto
            isJumping = false;
        }, 500); // Tempo total do salto
    }

    function checkCollision(cactus) {
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        if (
            dinoRect.left < cactusRect.right &&
            dinoRect.right > cactusRect.left &&
            dinoRect.bottom > cactusRect.top
        ) {
            gameOver = true;
            alert(`Game Over! Sua pontuação final é ${score}`);
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') jump(); // Salta quando a barra de espaço é pressionada
    });

    // Cria um novo cacto a cada intervalo definido
    const cactusCreation = setInterval(() => {
        createCactus();
        cactusCount++;

        // Aumenta a frequência de criação de cactos a cada 5 segundos
        if (cactusCount % 5 === 0) {
            clearInterval(cactusCreation);
            cactusInterval = Math.max(1000, cactusInterval - 500); // Aumenta a velocidade, mínimo de 1 segundo
            setInterval(createCactus, cactusInterval);
        }
    }, cactusInterval);
});

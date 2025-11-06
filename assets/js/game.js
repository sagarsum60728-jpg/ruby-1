// Sports Rundash 3D Runner Game
(function() {
    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game state
    let gameRunning = false;
    let score = 0;
    let coins = 0;
    let highScore = localStorage.getItem('Sports Rundash_highscore') || 0;
    document.getElementById('highScore').textContent = highScore;
    
    // Canvas sizing
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = Math.min(canvas.width * 0.6, 500);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Game elements
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: 40,
        height: 60,
        speed: 5,
        jumpPower: 12,
        isJumping: false,
        velocityY: 0,
        gravity: 0.5
    };
    
    const platforms = [];
    const coinsList = [];
    const obstacles = [];
    
    // Initialize game elements
    function initGame() {
        platforms.length = 0;
        coinsList.length = 0;
        obstacles.length = 0;
        
        // Create initial platforms
        for (let i = 0; i < 10; i++) {
            platforms.push({
                x: Math.random() * canvas.width,
                y: canvas.height - 50 - (i * 100),
                width: 150 + Math.random() * 100,
                height: 20
            });
        }
        
        // Create coins
        for (let i = 0; i < 20; i++) {
            coinsList.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height / 2,
                width: 20,
                height: 20,
                collected: false
            });
        }
        
        // Create obstacles
        for (let i = 0; i < 8; i++) {
            obstacles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height / 1.5,
                width: 30,
                height: 30,
                speed: 2 + Math.random() * 3
            });
        }
        
        // Reset player
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
        player.isJumping = false;
        player.velocityY = 0;
        
        // Reset score
        score = 0;
        coins = 0;
        document.getElementById('score').textContent = score;
        document.getElementById('coins').textContent = coins;
    }
    
    // Draw functions with 3D perspective
    function drawPlayer() {
        // Body
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(player.x - player.width/2, player.y - player.height, player.width, player.height);
        
        // Face details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x - player.width/4, player.y - player.height + 10, 10, 10);
        ctx.fillRect(player.x + player.width/4 - 10, player.y - player.height + 10, 10, 10);
        
        // Mouth
        ctx.beginPath();
        ctx.moveTo(player.x - player.width/4, player.y - player.height + 30);
        ctx.lineTo(player.x + player.width/4, player.y - player.height + 30);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
    }
    
    function drawPlatforms() {
        platforms.forEach(platform => {
            // Platform top
            ctx.fillStyle = '#10B981';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform side (for 3D effect)
            ctx.fillStyle = '#0D966E';
            ctx.beginPath();
            ctx.moveTo(platform.x, platform.y);
            ctx.lineTo(platform.x + 10, platform.y + 10);
            ctx.lineTo(platform.x + 10, platform.y + platform.height + 10);
            ctx.lineTo(platform.x, platform.y + platform.height);
            ctx.closePath();
            ctx.fill();
            
            // Platform top pattern
            ctx.strokeStyle = '#0D966E';
            ctx.beginPath();
            for (let i = 0; i < platform.width; i += 10) {
                ctx.moveTo(platform.x + i, platform.y);
                ctx.lineTo(platform.x + i, platform.y + platform.height);
            }
            ctx.stroke();
        });
    }
    
    function drawCoins() {
        coinsList.forEach(coin => {
            if (!coin.collected) {
                // Coin with shine effect
                ctx.fillStyle = '#FBBF24';
                ctx.beginPath();
                ctx.arc(coin.x, coin.y, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Coin highlight
                ctx.fillStyle = '#FDE68A';
                ctx.beginPath();
                ctx.arc(coin.x - coin.width/4, coin.y - coin.height/4, coin.width/6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    function drawObstacles() {
        obstacles.forEach(obstacle => {
            // Obstacle with 3D effect
            ctx.fillStyle = '#EF4444';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Obstacle top
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width/2, obstacle.y - obstacle.height/2);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
            ctx.closePath();
            ctx.fill();
            
            // Spikes
            ctx.strokeStyle = '#991B1B';
            ctx.lineWidth = 2;
            for (let i = 0; i < obstacle.width; i += 10) {
                ctx.beginPath();
                ctx.moveTo(obstacle.x + i, obstacle.y);
                ctx.lineTo(obstacle.x + i + 5, obstacle.y - 8);
                ctx.lineTo(obstacle.x + i + 10, obstacle.y);
                ctx.stroke();
            }
        });
    }
    
    function drawBackground() {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1E40AF');
        gradient.addColorStop(1, '#1E3A8A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height / 2;
            const size = Math.random() * 2;
            ctx.fillRect(x, y, size, size);
        }
        
        // Distant mountains
        ctx.fillStyle = '#374151';
        for (let i = 0; i < 5; i++) {
            const height = 50 + Math.random() * 70;
            ctx.beginPath();
            ctx.moveTo(i * canvas.width/5, canvas.height/2);
            ctx.lineTo(i * canvas.width/5 + canvas.width/10, canvas.height/2 - height);
            ctx.lineTo(i * canvas.width/5 + canvas.width/5, canvas.height/2);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // Game logic
    function updatePlayer() {
        // Apply gravity
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        
        // Check platform collisions
        let onPlatform = false;
        platforms.forEach(platform => {
            if (player.x + player.width/2 > platform.x && 
                player.x - player.width/2 < platform.x + platform.width &&
                player.y + 5 > platform.y && 
                player.y < platform.y + platform.height &&
                player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                onPlatform = true;
            }
        });
        
        // Floor collision
        if (player.y > canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            onPlatform = true;
        }
        
        // Screen boundaries
        if (player.x - player.width/2 < 0) player.x = player.width/2;
        if (player.x + player.width/2 > canvas.width) player.x = canvas.width - player.width/2;
        
        return onPlatform;
    }
    
    function updateCoins() {
        coinsList.forEach(coin => {
            if (!coin.collected && 
                player.x + player.width/2 > coin.x - coin.width/2 &&
                player.x - player.width/2 < coin.x + coin.width/2 &&
                player.y - player.height < coin.y + coin.height/2 &&
                player.y > coin.y - coin.height/2) {
                coin.collected = true;
                coins++;
                score += 100;
                document.getElementById('coins').textContent = coins;
                document.getElementById('score').textContent = score;
            }
        });
    }
    
    function updateObstacles() {
        obstacles.forEach(obstacle => {
            // Move obstacles
            obstacle.y += obstacle.speed;
            
            // Reset obstacles that go off screen
            if (obstacle.y > canvas.height) {
                obstacle.y = -50;
                obstacle.x = Math.random() * canvas.width;
            }
            
            // Check for collision
            if (player.x + player.width/2 > obstacle.x &&
                player.x - player.width/2 < obstacle.x + obstacle.width &&
                player.y - player.height < obstacle.y + obstacle.height &&
                player.y > obstacle.y) {
                gameOver();
            }
        });
    }
    
    function gameOver() {
        gameRunning = false;
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('Sports Rundash_highscore', highScore);
            document.getElementById('highScore').textContent = highScore;
        }
        
        // Show game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '40px Inter';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 40);
        
        ctx.font = '24px Inter';
        ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        ctx.fillText(`High Score: ${highScore}`, canvas.width/2, canvas.height/2 + 60);
        
        ctx.textAlign = 'start';
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game state
        updatePlayer();
        updateCoins();
        updateObstacles();
        
        // Draw game elements
        drawBackground();
        drawPlatforms();
        drawCoins();
        drawObstacles();
        drawPlayer();
        
        // Increment score
        score++;
        document.getElementById('score').textContent = score;
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Input handling
    const keys = {};
    
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Jump when space is pressed and player is not already jumping
        if ((e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') && 
            !player.isJumping) {
            player.velocityY = -player.jumpPower;
            player.isJumping = true;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    function handleInput() {
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
            player.x -= player.speed;
        }
        if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            player.x += player.speed;
        }
        if (keys['s'] || keys['S'] || keys['ArrowDown']) {
            player.y += player.speed;
        }
    }
    
    // Input handling interval
    setInterval(handleInput, 1000/60);
    
    // Button event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        if (!gameRunning) {
            initGame();
            gameRunning = true;
            gameLoop();
        }
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        initGame();
        gameRunning = true;
        gameLoop();
    });
    
    // Initial game setup
    initGame();
    
    // Draw initial state
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawObstacles();
    drawPlayer();
})();
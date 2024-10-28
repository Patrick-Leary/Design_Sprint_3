const ballManager = {
    initialSpawnInterval: 3000,
    minSpawnInterval: 500,
    spawnIntervalDecrease: 100,
    currentSpawnInterval: 3000,
    spawnTimer: null,
    ballSpeed: 0.02,
    collisionThreshold: 0.5,

    spawnBall: function() {
        if (!gameManager.isGameRunning) return;
    
        const ballsContainer = document.getElementById('balls');
        if (!ballsContainer) {
            console.error('Balls container not found!');
            return;
        }
    
        // Create a container for the ball and its health bar
        const ballEntity = document.createElement('a-entity');
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 3 + 1;
        const z = Math.random() * -5 - 3;
        ballEntity.setAttribute('position', `${x} ${y} ${z}`);
        
        const ball = document.createElement('a-sphere');
        ball.setAttribute('position', '0 0 0');
        ball.setAttribute('radius', '0.25');
        ball.setAttribute('class', 'ball');
        ball.setAttribute('data-health', 100);
        ball.setAttribute('color', '#FF6B1A');
        
        // Create health bar background (gray background)
        const healthBarBg = document.createElement('a-plane');
        healthBarBg.setAttribute('position', '0 0.5 0');
        healthBarBg.setAttribute('width', '0.5');
        healthBarBg.setAttribute('height', '0.1');
        healthBarBg.setAttribute('color', '#333333');
        
        // Create health bar foreground (green bar)
        const healthBarFg = document.createElement('a-plane');
        healthBarFg.setAttribute('position', '0 0 0.001');
        healthBarFg.setAttribute('width', '0.5');
        healthBarFg.setAttribute('height', '0.1');
        healthBarFg.setAttribute('color', '#00ff00');
        healthBarFg.setAttribute('class', 'health-bar');
        
        // Create damage bar (red bar)
        const damageBar = document.createElement('a-plane');
        damageBar.setAttribute('position', '0 0 0.0005');
        damageBar.setAttribute('width', '0');
        damageBar.setAttribute('height', '0.1');
        damageBar.setAttribute('color', '#ff0000');
        damageBar.setAttribute('class', 'damage-bar');
    
        // Add look-at component to health bar container
        healthBarBg.setAttribute('look-at', '[camera]');
        
        // Assemble the health bar
        healthBarBg.appendChild(healthBarFg);
        healthBarBg.appendChild(damageBar);
        
        // Assemble the ball entity
        ballEntity.appendChild(ball);
        ballEntity.appendChild(healthBarBg);
        
        ballsContainer.appendChild(ballEntity);
    
        this.currentSpawnInterval = Math.max(
            this.minSpawnInterval, 
            this.currentSpawnInterval - this.spawnIntervalDecrease
        );
        this.scheduleNextSpawn();
    },
    
    updateBallHealth: function(ball, health) {
        const healthPercent = health / 100;
        const healthBarBg = ball.parentNode.querySelector('a-plane');
        const healthBar = healthBarBg.querySelector('.health-bar');
        const damageBar = healthBarBg.querySelector('.damage-bar');
        
        if (healthBar && damageBar) {
            // Update health bar width and position
            healthBar.setAttribute('width', 0.5 * healthPercent);
            healthBar.setAttribute('position', `${-0.25 + (0.25 * healthPercent)} 0 0.001`);
            
            // Update damage bar width and position
            damageBar.setAttribute('width', 0.5 * (1 - healthPercent));
            damageBar.setAttribute('position', `${0.25 * healthPercent} 0 0.0005`);
        }
    },

    scheduleNextSpawn: function() {
        clearTimeout(this.spawnTimer);
        if (gameManager.isGameRunning) {
            this.spawnTimer = setTimeout(() => this.spawnBall(), this.currentSpawnInterval);
        }
    },

    startSpawning: function() {
        console.log('Starting ball spawning');
        this.currentSpawnInterval = this.initialSpawnInterval;
        this.spawnBall(); // Spawn first ball immediately
        this.scheduleNextSpawn(); // Schedule next spawn
    },

    stopSpawning: function() {
        clearTimeout(this.spawnTimer);
        // Clean up existing ball entities
        const balls = document.querySelectorAll('.ball');
        balls.forEach(ball => {
            const ballEntity = ball.parentNode;
            if (ballEntity && ballEntity.parentNode) {
                ballEntity.parentNode.removeChild(ballEntity);
            }
        });
    },

    updateBallPositions: function() {
        if (!gameManager.isGameRunning) return;

        const balls = document.querySelectorAll('.ball');
        const camera = document.querySelector('[camera]');
        const cameraPos = new THREE.Vector3();
        camera.object3D.getWorldPosition(cameraPos);

        balls.forEach(ball => {
            // Get the parent entity that contains both ball and health bar
            const ballEntity = ball.parentNode;
            const ballPos = new THREE.Vector3();
            ballEntity.object3D.getWorldPosition(ballPos);
            
            // Calculate direction towards player
            const direction = new THREE.Vector3()
                .subVectors(cameraPos, ballPos)
                .normalize()
                .multiplyScalar(this.ballSpeed);

            // Update ball entity position
            const currentPosition = ballEntity.getAttribute('position');
            ballEntity.setAttribute('position', {
                x: currentPosition.x + direction.x,
                y: currentPosition.y + direction.y,
                z: currentPosition.z + direction.z
            });

            // Check for collision with player
            const distance = cameraPos.distanceTo(ballPos);
            if (distance < this.collisionThreshold) {
                gameManager.endGame("Game Over! A ball hit you!");
            }
        });
    }
};


AFRAME.registerComponent('ball-manager', {
    init: function() {
        this.tick = AFRAME.utils.throttleTick(this.tick, 16, this); // ~60fps
        ballManager.startSpawning();
    },

    tick: function() {
        if (gameManager.isGameRunning) {
            ballManager.updateBallPositions();
        }
    },

    remove: function() {
        ballManager.stopSpawning();
    }
});
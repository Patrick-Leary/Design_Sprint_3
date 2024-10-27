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

        const balls = document.getElementById('balls');
        const ball = document.createElement('a-sphere');
        
        // Random position within bounds
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 3 + 1;
        const z = Math.random() * -5 - 3;
        
        ball.setAttribute('position', `${x} ${y} ${z}`);
        ball.setAttribute('radius', '0.25');
        ball.setAttribute('class', 'ball');
        ball.setAttribute('dynamic-body', {
            mass: 1,
            linearDamping: 0.01,
            angularDamping: 0.01
        });

        // Random color selection
        const colors = ['#EF2D5E', '#FF9F1C', '#2ECC71', '#3498DB'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        ball.setAttribute('color', randomColor);

        balls.appendChild(ball);

        // Schedule next spawn with decreased interval
        this.currentSpawnInterval = Math.max(
            this.minSpawnInterval, 
            this.currentSpawnInterval - this.spawnIntervalDecrease
        );
        this.scheduleNextSpawn();
    },

    scheduleNextSpawn: function() {
        clearTimeout(this.spawnTimer);
        if (gameManager.isGameRunning) {
            this.spawnTimer = setTimeout(() => this.spawnBall(), this.currentSpawnInterval);
        }
    },

    startSpawning: function() {
        this.currentSpawnInterval = this.initialSpawnInterval;
        this.scheduleNextSpawn();
    },

    stopSpawning: function() {
        clearTimeout(this.spawnTimer);
        // Clean up existing balls
        const balls = document.querySelectorAll('.ball');
        balls.forEach(ball => {
            if (ball.parentNode) {
                ball.parentNode.removeChild(ball);
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
            const ballPos = new THREE.Vector3();
            ball.object3D.getWorldPosition(ballPos);
            
            // Calculate direction towards player
            const direction = new THREE.Vector3()
                .subVectors(cameraPos, ballPos)
                .normalize()
                .multiplyScalar(this.ballSpeed);

            // Update ball position
            const currentPosition = ball.getAttribute('position');
            ball.setAttribute('position', {
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
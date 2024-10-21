const ballManager = {
    initialSpawnInterval: 3000,
    minSpawnInterval: 500,
    spawnIntervalDecrease: 100,
    currentSpawnInterval: 3000,
    spawnTimer: null,
    ballSpeed: 0.02,
    collisionThreshold: 0.5,

    spawnBall: function() {
        const balls = document.getElementById('balls');
        const ball = document.createElement('a-sphere');
        ball.setAttribute('position', `${Math.random() * 10 - 5} ${Math.random() * 5 + 1} ${Math.random() * -5 - 3}`);
        ball.setAttribute('radius', '0.5');
        ball.setAttribute('color', '#EF2D5E');
        ball.setAttribute('dynamic-body', '');
        ball.classList.add('ball');
        balls.appendChild(ball);

        this.currentSpawnInterval = Math.max(this.minSpawnInterval, this.currentSpawnInterval - this.spawnIntervalDecrease);
        this.scheduleNextSpawn();
    },

    scheduleNextSpawn: function() {
        clearTimeout(this.spawnTimer);
        this.spawnTimer = setTimeout(() => this.spawnBall(), this.currentSpawnInterval);
    },

    startSpawning: function() {
        this.currentSpawnInterval = this.initialSpawnInterval;
        this.scheduleNextSpawn();
    },

    stopSpawning: function() {
        clearTimeout(this.spawnTimer);
    },

    updateBallPositions: function() {
        const balls = document.querySelectorAll('.ball');
        const player = document.getElementById('player');
        const playerPos = new THREE.Vector3().setFromMatrixPosition(player.object3D.matrixWorld);

        balls.forEach(ball => {
            const ballPos = new THREE.Vector3().setFromMatrixPosition(ball.object3D.matrixWorld);
            const direction = new THREE.Vector3().subVectors(playerPos, ballPos).normalize();
            ball.object3D.position.add(direction.multiplyScalar(this.ballSpeed));

            // Check for collision
            const distance = ballPos.distanceTo(playerPos);
            if (distance < this.collisionThreshold) {
                this.handleCollision();
            }
        });
    },

    handleCollision: function() {
        this.stopSpawning();
    }
};

AFRAME.registerComponent('ball-manager', {
    init: function() {
        ballManager.startSpawning();
    },
    tick: function() {
        if (gameManager.isGameRunning) {
            ballManager.updateBallPositions();
        }
    }
});
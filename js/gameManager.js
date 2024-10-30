const gameManager = {
    isGameRunning: false,
    startTime: null,
    hits: 0,

    init: function() {
        menuManager.init();
    },

    startGame: function() {
        this.isGameRunning = true;
        this.startTime = Date.now();
        this.hits = 0;
        menuManager.hideAllMenus();

        soundManager.playGameMusic();
        
        // Clear any existing balls
        const ballsContainer = document.getElementById('balls');
        while (ballsContainer.firstChild) {
            ballsContainer.removeChild(ballsContainer.firstChild);
        }
        
        // Initialize ball manager
        const ballManagerEntity = document.createElement('a-entity');
        ballManagerEntity.setAttribute('ball-manager', '');
        document.querySelector('a-scene').appendChild(ballManagerEntity);
        
        // Spawn first ball immediately
        ballManager.spawnBall();
    },

    incrementHits: function() {
        this.hits++;
    },

    endGame: function(message) {
        if (!this.isGameRunning) return;
        
        this.isGameRunning = false;
        soundManager.stopLaserHit(); // Stop any playing laser sound
        soundManager.playMenuMusic();
        const timePlayed = Math.floor((Date.now() - this.startTime) / 1000);
        const endMessage = `${message}\nYou destroyed ${this.hits} balls in ${timePlayed} seconds!`;
        menuManager.showEndMenu(endMessage);
        
        // Clean up
        const ballManagerEntity = document.querySelector('[ball-manager]');
        if (ballManagerEntity) {
            ballManagerEntity.parentNode.removeChild(ballManagerEntity);
        }
    },

    restartGame: function() {
        this.startGame();
    }
};
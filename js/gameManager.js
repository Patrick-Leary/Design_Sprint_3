const gameManager = {
    hits: 0,
    startTime: null,
    isGameRunning: false,

    init: function() {
        menuManager.init();
    },

    startGame: function() {
        this.hits = 0;
        this.startTime = Date.now();
        this.isGameRunning = true;
        const sceneEl = document.querySelector('a-scene');
        sceneEl.setAttribute('ball-manager', '');
        document.querySelector('a-scene').addEventListener('click', shootSphere);
        menuManager.disableMenuInteractivity();
    },

    restartGame: function() {
        this.endGame();
        this.startGame();
    },

    incrementHits: function() {
        this.hits++;
    },

    endGame: function(message) {
        if (!this.isGameRunning) return;
        this.isGameRunning = false;
        ballManager.stopSpawning();
        let timeTaken = Math.round((Date.now() - this.startTime) / 1000);
        const finalMessage = `${message}\nYou shot ${this.hits} balls in ${timeTaken} seconds!`;
        menuManager.showEndMenu(finalMessage);
        document.querySelector('a-scene').removeEventListener('click', shootSphere);
        document.querySelector('a-scene').removeAttribute('ball-manager');
        // Remove all existing balls
        const balls = document.querySelectorAll('.ball');
        balls.forEach(ball => ball.parentNode.removeChild(ball));
        menuManager.enableMenuInteractivity();
    }
};
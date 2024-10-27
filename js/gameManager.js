const gameManager = {
    isGameRunning: false,
    startTime: null,

    init: function() {
        menuManager.init();
    },

    startGame: function() {
        this.isGameRunning = true;
        this.startTime = Date.now();
        menuManager.hideAllMenus();
        
        // End the game after 10 seconds for testing
        setTimeout(() => {
            this.endGame("Time's up!");
        }, 10000);
    },

    endGame: function(message) {
        if (!this.isGameRunning) return;
        
        this.isGameRunning = false;
        const timePlayed = Math.floor((Date.now() - this.startTime) / 1000);
        const endMessage = `${message}\nYou played for ${timePlayed} seconds!`;
        menuManager.showEndMenu(endMessage);
    },

    restartGame: function() {
        this.startGame();
    }
};
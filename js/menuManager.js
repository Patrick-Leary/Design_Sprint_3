const menuManager = {
    startMenu: null,
    endMenu: null,

    init: function() {
        this.createStartMenu();
        this.createEndMenu();
        this.showStartMenu();
    },

    createStartMenu: function() {
        this.startMenu = document.createElement('a-entity');
        this.startMenu.setAttribute('id', 'startMenu');
        this.startMenu.setAttribute('position', '0 1.6 -4');

        const startButton = document.createElement('a-gui-button');
        startButton.setAttribute('width', '2.5');
        startButton.setAttribute('height', '0.75');
        startButton.setAttribute('value', 'Start Game');
        startButton.setAttribute('font-size', '0.25');
        startButton.setAttribute('margin', '0 0 0.2 0');
        startButton.addEventListener('click', () => this.startGame());

        this.startMenu.appendChild(startButton);
        document.querySelector('a-scene').appendChild(this.startMenu);
    },

    createEndMenu: function() {
        this.endMenu = document.createElement('a-entity');
        this.endMenu.setAttribute('id', 'endMenu');
        this.endMenu.setAttribute('position', '0 1.6 -4');
        this.endMenu.setAttribute('visible', false);

        const endMessage = document.createElement('a-gui-label');
        endMessage.setAttribute('width', '4');
        endMessage.setAttribute('height', '0.75');
        endMessage.setAttribute('value', 'Game Over!');
        endMessage.setAttribute('font-size', '0.35');
        endMessage.setAttribute('position', '0 1 0');

        const scoreMessage = document.createElement('a-gui-label');
        scoreMessage.setAttribute('width', '4');
        scoreMessage.setAttribute('height', '0.75');
        scoreMessage.setAttribute('value', '');
        scoreMessage.setAttribute('font-size', '0.25');
        scoreMessage.setAttribute('position', '0 0 0');

        const restartButton = document.createElement('a-gui-button');
        restartButton.setAttribute('width', '2.5');
        restartButton.setAttribute('height', '0.75');
        restartButton.setAttribute('value', 'Restart Game');
        restartButton.setAttribute('font-size', '0.25');
        restartButton.setAttribute('position', '0 -1 0');
        restartButton.addEventListener('click', () => this.restartGame());

        this.endMenu.appendChild(endMessage);
        this.endMenu.appendChild(scoreMessage);
        this.endMenu.appendChild(restartButton);
        document.querySelector('a-scene').appendChild(this.endMenu);
    },

    disableMenuInteractivity: function() {
        const guiElements = document.querySelectorAll('[gui-interactable]');
        guiElements.forEach(el => {
            el.setAttribute('gui-interactable', 'enabled: false');
        });
    },

    enableMenuInteractivity: function() {
        const guiElements = document.querySelectorAll('[gui-interactable]');
        guiElements.forEach(el => {
            el.setAttribute('gui-interactable', 'enabled: true');
        });
    },

    startGame: function() {
        this.startMenu.setAttribute('visible', false);
        this.disableMenuInteractivity();
        gameManager.startGame();
    },

    restartGame: function() {
        this.endMenu.setAttribute('visible', false);
        this.disableMenuInteractivity();
        gameManager.restartGame();
    },

    showEndMenu: function(message) {
        this.startMenu.setAttribute('visible', false);
        this.endMenu.setAttribute('visible', true);
        this.endMenu.querySelector('a-gui-label[value="Game Over!"]').setAttribute('value', 'Game Over!');
        this.endMenu.querySelector('a-gui-label[value=""]').setAttribute('value', message);
        this.enableMenuInteractivity();
    }
};
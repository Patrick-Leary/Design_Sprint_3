const menuManager = {
    init: function() {
        this.createStartMenu();
        this.createEndMenu();
        this.showStartMenu();
    },

    createStartMenu: function() {
        const startMenu = document.createElement('a-entity');
        startMenu.setAttribute('id', 'startMenu');
        startMenu.setAttribute('position', '0 1.6 -4');
        
        startMenu.innerHTML = `
            <a-text value="Sphere Shooter" align="center" position="0 0.5 0" scale="1.5 1.5 1.5"></a-text>
            <a-entity
                id="startButton"
                class="clickable"
                geometry="primitive: plane; width: 2; height: 0.7"
                material="color: #4CAF50"
                position="0 0 0"
                animation__hover="property: material.color; startEvents: mouseenter; endEvents: mouseleave; from: #4CAF50; to: #45a049; dur: 200">
                <a-text
                    value="Start Game"
                    align="center"
                    position="0 0 0.01"
                    scale="0.5 0.5 0.5"
                    color="white">
                </a-text>
            </a-entity>
        `;
        
        document.querySelector('#menuContainer').appendChild(startMenu);
        
        const startButton = startMenu.querySelector('#startButton');
        startButton.addEventListener('click', () => gameManager.startGame());
    },

    createEndMenu: function() {
        const endMenu = document.createElement('a-entity');
        endMenu.setAttribute('id', 'endMenu');
        endMenu.setAttribute('position', '0 1.6 -4');
        endMenu.setAttribute('visible', false);
        
        endMenu.innerHTML = `
            <a-text id="endMessage" value="" align="center" position="0 0.5 0"></a-text>
            <a-gui-button
                id="restartButton"
                width="2"
                height="0.7"
                base-depth="0.025"
                depth="0.1"
                gap="0.1"
                class="clickable"
                value="Play Again"
                font-size="0.3"
                margin="0 0 0.2 0"
                position="0 0 0">
            </a-gui-button>
        `;
        
        document.querySelector('#menuContainer').appendChild(endMenu);
        
        const restartButton = endMenu.querySelector('#restartButton');
        restartButton.addEventListener('click', () => gameManager.restartGame());
    },

    showStartMenu: function() {
        const startMenu = document.querySelector('#startMenu');
        const endMenu = document.querySelector('#endMenu');
        
        startMenu.setAttribute('visible', true);
        startMenu.querySelector('#startButton').classList.add('clickable');
        
        endMenu.setAttribute('visible', false);
        endMenu.querySelector('#restartButton').classList.remove('clickable');
    },

    showEndMenu: function(message) {
        const startMenu = document.querySelector('#startMenu');
        const endMenu = document.querySelector('#endMenu');
        
        startMenu.setAttribute('visible', false);
        startMenu.querySelector('#startButton').classList.remove('clickable');
        
        endMenu.setAttribute('visible', true);
        endMenu.querySelector('#restartButton').classList.add('clickable');
        endMenu.querySelector('#endMessage').setAttribute('value', message);
    },

    hideAllMenus: function() {
        const startMenu = document.querySelector('#startMenu');
        const endMenu = document.querySelector('#endMenu');
        
        startMenu.setAttribute('visible', false);
        startMenu.querySelector('#startButton').classList.remove('clickable');
        
        endMenu.setAttribute('visible', false);
        endMenu.querySelector('#restartButton').classList.remove('clickable');
    }
};
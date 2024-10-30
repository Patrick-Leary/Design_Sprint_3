const menuManager = {
    init: function() {
        this.createStartMenu();
        this.createEndMenu();
        this.showStartMenu();
    },

    createStartMenu: function() {
        // Create parent container
        const startMenu = document.createElement('a-entity');
        startMenu.setAttribute('id', 'startMenu');
        startMenu.setAttribute('visible', true);
        
        // Create title text entity (facing straight)
        const titleEntity = document.createElement('a-entity');
        titleEntity.setAttribute('position', '0 1.6 -4');
        titleEntity.innerHTML = `
            <a-text 
                value="Sphere Shooter"
                align="center"
                scale="1.5 1.5 1.5"
                position="0 0 0">
            </a-text>
        `;
        
        // Create button entity (angled up)
        const buttonEntity = document.createElement('a-entity');
        buttonEntity.setAttribute('position', '0 0.6 -2.5');
        buttonEntity.setAttribute('rotation', '-25 0 0');
        buttonEntity.innerHTML = `
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
        
        // Add both entities to the menu container
        startMenu.appendChild(titleEntity);
        startMenu.appendChild(buttonEntity);
        document.querySelector('#menuContainer').appendChild(startMenu);
        
        // Add click event listener
        const startButton = startMenu.querySelector('#startButton');
        startButton.addEventListener('click', () => gameManager.startGame());
    },

    createEndMenu: function() {
        // Create parent container
        const endMenu = document.createElement('a-entity');
        endMenu.setAttribute('id', 'endMenu');
        endMenu.setAttribute('visible', false);
        
        // Create text entity (facing straight)
        const messageEntity = document.createElement('a-entity');
        messageEntity.setAttribute('position', '0 1.6 -4');
        messageEntity.innerHTML = `
            <a-text 
                id="endMessage"
                value=""
                align="center"
                scale="1.2 1.2 1.2"
                position="0 0 0">
            </a-text>
        `;
        
        // Create button entity (angled up)
        const buttonEntity = document.createElement('a-entity');
        buttonEntity.setAttribute('position', '0 0.6 -2.5');
        buttonEntity.setAttribute('rotation', '-25 0 0');
        buttonEntity.innerHTML = `
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
        
        // Add both entities to the menu container
        endMenu.appendChild(messageEntity);
        endMenu.appendChild(buttonEntity);
        document.querySelector('#menuContainer').appendChild(endMenu);
        
        // Add click event listener
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
document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        soundManager.init();
        gameManager.init();
    } else {
        scene.addEventListener('loaded', function() {
            soundManager.init();
            gameManager.init();
        });
    }
});
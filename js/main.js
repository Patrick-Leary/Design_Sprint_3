document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        gameManager.init();
    } else {
        scene.addEventListener('loaded', function() {
            gameManager.init();
        });
    }
});
window.shootSphere = function(event) {
    if (!gameManager.isGameRunning) return;
    
    let camera = document.getElementById('player');
    let raycaster = camera.components.raycaster;
    let intersections = raycaster.intersections;

    if (intersections.length > 0) {
        let hitBall = intersections[0].object.el;
        if (hitBall.classList.contains('ball')) {
            hitBall.parentNode.removeChild(hitBall);
            gameManager.incrementHits();
        }
    }

    throwObject(camera);
};

function throwObject(camera) {
    let direction = new THREE.Vector3();
    camera.object3D.getWorldDirection(direction);

    let throwable = document.createElement('a-box');
    throwable.setAttribute('position', camera.getAttribute('position'));
    throwable.setAttribute('depth', '0.1');
    throwable.setAttribute('height', '0.1');
    throwable.setAttribute('width', '0.1');
    throwable.setAttribute('color', '#FF0000');
    throwable.setAttribute('dynamic-body', '');

    direction.multiplyScalar(-10);
    throwable.setAttribute('velocity', `${direction.x} ${direction.y} ${direction.z}`);

    document.querySelector('a-scene').appendChild(throwable);
}
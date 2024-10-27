window.shootSphere = function(event) {
    if (!gameManager.isGameRunning) return;
    
    const camera = document.querySelector('[camera]');
    
    // Create raycaster for shooting
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    camera.object3D.getWorldDirection(direction);
    
    const position = new THREE.Vector3();
    camera.object3D.getWorldPosition(position);
    
    raycaster.set(position, direction);
    
    // Get all balls
    const balls = Array.from(document.querySelectorAll('.ball'));
    const ballObjects = balls.map(ball => {
        return {
            el: ball,
            object3D: ball.object3D
        };
    });
    
    // Check for intersections
    const intersections = raycaster.intersectObjects(
        ballObjects.map(ball => ball.object3D),
        true
    );
    
    if (intersections.length > 0) {
        // Find the corresponding element
        const hitBall = ballObjects.find(ball => 
            ball.object3D === intersections[0].object || 
            ball.object3D.isAncestor(intersections[0].object)
        );
        
        if (hitBall) {
            hitBall.el.parentNode.removeChild(hitBall.el);
            gameManager.incrementHits();
            return;
        }
    }
    
    // If no direct hit, throw projectile
    throwProjectile(camera);
};

function throwProjectile(camera) {
    const direction = new THREE.Vector3();
    camera.object3D.getWorldDirection(direction);
    
    const position = new THREE.Vector3();
    camera.object3D.getWorldPosition(position);
    
    const projectile = document.createElement('a-sphere');
    projectile.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    projectile.setAttribute('radius', '0.1');
    projectile.setAttribute('color', '#FF0000');
    projectile.setAttribute('class', 'projectile');
    
    // Add physics body
    projectile.setAttribute('dynamic-body', {
        mass: 0.1,
        linearDamping: 0.01,
        angularDamping: 0.01
    });
    
    // Apply velocity in shooting direction
    direction.multiplyScalar(15);
    projectile.setAttribute('velocity', `${direction.x} ${direction.y} ${direction.z}`);
    
    // Remove projectile after 3 seconds
    setTimeout(() => {
        if (projectile.parentNode) {
            projectile.parentNode.removeChild(projectile);
        }
    }, 3000);
    
    document.querySelector('a-scene').appendChild(projectile);
}
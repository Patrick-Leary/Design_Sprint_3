AFRAME.registerComponent('laser-system', {
    init: function() {
        this.laser = this.createLaser();
        this.camera = this.el;
        this.raycaster = this.el.components.raycaster;
        this.direction = new THREE.Vector3();
        
        // Ensure raycaster is configured correctly
        if (this.raycaster) {
            this.raycaster.refreshObjects();
        }
        
        this.tick = AFRAME.utils.throttleTick(this.tick, 16, this);
    },

    tick: function() {
        if (!gameManager.isGameRunning) return;

        // Get direction from raycaster
        const raycasterComponent = this.el.components.raycaster;
        if (!raycasterComponent) return;

        // Update laser direction to match cursor
        const direction = raycasterComponent.raycaster.ray.direction;
        const endPoint = new THREE.Vector3()
            .copy(direction)
            .multiplyScalar(50);
            
        this.laser.setAttribute('line', {
            start: '0 0 0',
            end: `${endPoint.x} ${endPoint.y} ${endPoint.z}`
        });

        // Check for ball hits
        const intersections = raycasterComponent.intersections;
        if (intersections.length > 0) {
            const hitEl = intersections[0].object.el;
            if (hitEl && hitEl.classList.contains('ball')) {
                this.damageBall(hitEl);
            }
        }
    },

    createLaser: function() {
        const laser = document.createElement('a-entity');
        laser.setAttribute('visible', true);
        laser.setAttribute('position', '0.01 -0.01 0');
        laser.setAttribute('line', {
            color: '#FF6B1A',
            opacity: 0.7,
            start: '0 0 0',
            end: '0 0 -50'
        });
        this.el.appendChild(laser);
        return laser;
    },

    damageBall: function(ball) {
        let health = parseFloat(ball.getAttribute('data-health') || 100);
        health -= 2; // Damage per frame
        ball.setAttribute('data-health', health);
        
        // Update health bar using ballManager
        ballManager.updateBallHealth(ball, health);
    
        if (health <= 0) {
            this.explodeBall(ball);
        }
    },

    explodeBall: function(ball) {
        const ballEntity = ball.parentNode;
        const pos = ballEntity.getAttribute('position');
    
        // Create multiple small spheres for explosion effect instead of using particle system
        const particleCount = 10;
        const particles = document.createElement('a-entity');
        particles.setAttribute('position', pos);
    
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('a-sphere');
            
            // Random direction for particle
            const angle = (Math.random() * Math.PI * 2);
            const upwardBias = Math.random() * 0.5 + 0.5; // Bias upward
            const speed = Math.random() * 0.1 + 0.05;
            
            particle.setAttribute('radius', '0.05');
            particle.setAttribute('color', '#FF6B1A');
            particle.setAttribute('position', '0 0 0');
            
            // Add animation for particle movement
            particle.setAttribute('animation', {
                property: 'position',
                dur: 500,
                easing: 'easeOutQuad',
                to: `${Math.cos(angle) * speed} ${upwardBias * speed} ${Math.sin(angle) * speed}`
            });
            
            // Add animation for fade out
            particle.setAttribute('animation__fade', {
                property: 'material.opacity',
                dur: 500,
                from: '1',
                to: '0',
                easing: 'easeOutQuad'
            });
    
            // Add light to particle
            const particleLight = document.createElement('a-entity');
            particleLight.setAttribute('light', {
                type: 'point',
                intensity: '0.2',
                distance: '0.5',
                color: '#FF6B1A'
            });
            particle.appendChild(particleLight);
            
            particles.appendChild(particle);
        }
    
        document.querySelector('a-scene').appendChild(particles);
        
        // Remove explosion after animation
        setTimeout(() => {
            if (particles.parentNode) {
                particles.parentNode.removeChild(particles);
            }
        }, 1000);
    
        // Remove ball entity (including health bar)
        if (ballEntity && ballEntity.parentNode) {
            ballEntity.parentNode.removeChild(ballEntity);
        }
        gameManager.incrementHits();
    }
});
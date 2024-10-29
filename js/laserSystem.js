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
    
        // Create explosion container
        const explosionContainer = document.createElement('a-entity');
        explosionContainer.setAttribute('position', pos);
    
        // Create main explosion sphere
        const mainSphere = document.createElement('a-sphere');
        mainSphere.setAttribute('radius', '0.1');
        mainSphere.setAttribute('color', '#00ff00');
        mainSphere.setAttribute('material', {
            emissive: '#00ff00',
            emissiveIntensity: 2,
            opacity: 0.8,
            transparent: true
        });
        
        // Animate main sphere
        mainSphere.setAttribute('animation__scale', {
            property: 'scale',
            from: '1 1 1',
            to: '3 3 3',
            dur: 500,
            easing: 'easeOutQuad'
        });
        mainSphere.setAttribute('animation__fade', {
            property: 'material.opacity',
            from: '0.8',
            to: '0',
            dur: 500,
            easing: 'easeOutQuad'
        });
    
        // Add central light
        const centerLight = document.createElement('a-entity');
        centerLight.setAttribute('light', {
            type: 'point',
            color: '#00ff00',
            intensity: 2,
            distance: 3
        });
        centerLight.setAttribute('animation__intensity', {
            property: 'light.intensity',
            from: '2',
            to: '0',
            dur: 500,
            easing: 'easeOutQuad'
        });
    
        // Create random particles
        const particleCount = 12; // Reduced particle count
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('a-sphere');
            
            // Random direction in 3D space
            const theta = Math.random() * Math.PI * 2; // Horizontal angle
            const phi = Math.random() * Math.PI; // Vertical angle
            const speed = 0.5 + Math.random() * 1.5; // Random speed
            
            // Convert spherical coordinates to Cartesian
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);
            
            // Random size variation
            const scale = 0.5 + Math.random() * 0.5;
            
            particle.setAttribute('radius', '0.08');
            particle.setAttribute('color', '#00ff00');
            particle.setAttribute('material', {
                emissive: '#00ff00',
                emissiveIntensity: 1,
                opacity: 0.8,
                transparent: true
            });
            particle.setAttribute('position', '0 0 0');
            
            // Animate particles with random trajectories
            particle.setAttribute('animation__move', {
                property: 'position',
                from: '0 0 0',
                to: `${x * speed} ${y * speed} ${z * speed}`,
                dur: 750 + Math.random() * 250, // Random duration
                easing: 'easeOutCubic'
            });
            
            particle.setAttribute('animation__scale', {
                property: 'scale',
                from: `${scale} ${scale} ${scale}`,
                to: '0.1 0.1 0.1',
                dur: 750,
                easing: 'easeOutQuad'
            });
            
            particle.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: '0.8',
                to: '0',
                dur: 750,
                easing: 'easeOutQuad'
            });
            
            // Add light to each particle
            const particleLight = document.createElement('a-entity');
            particleLight.setAttribute('light', {
                type: 'point',
                color: '#00ff00',
                intensity: 0.5,
                distance: 1
            });
            particleLight.setAttribute('animation__intensity', {
                property: 'light.intensity',
                from: '0.5',
                to: '0',
                dur: 750,
                easing: 'easeOutQuad'
            });
            
            particle.appendChild(particleLight);
            explosionContainer.appendChild(particle);
        }
    
        // Add main sphere and center light
        explosionContainer.appendChild(mainSphere);
        explosionContainer.appendChild(centerLight);
        
        // Add to scene
        document.querySelector('a-scene').appendChild(explosionContainer);
        
        // Remove explosion after animation
        setTimeout(() => {
            if (explosionContainer.parentNode) {
                explosionContainer.parentNode.removeChild(explosionContainer);
            }
        }, 1000);
    
        // Remove ball entity (including health bar)
        if (ballEntity && ballEntity.parentNode) {
            ballEntity.parentNode.removeChild(ballEntity);
        }
        gameManager.incrementHits();
    }
});
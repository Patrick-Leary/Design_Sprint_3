const soundManager = {
    init: function() {
        this.menuMusic = document.querySelector('#menu-music-player');
        this.gameMusic = document.querySelector('#game-music-player');
        this.laserSound = null;
        this.isLaserPlaying = false;

        // Start menu music
        setTimeout(() => {
            this.playMenuMusic();
        }, 100);
    },

    playMenuMusic: function() {
        if (this.gameMusic && this.gameMusic.components.sound) {
            this.gameMusic.components.sound.stopSound();
        }
        if (this.menuMusic && this.menuMusic.components.sound) {
            this.menuMusic.components.sound.playSound();
        }
    },

    playGameMusic: function() {
        if (this.menuMusic && this.menuMusic.components.sound) {
            this.menuMusic.components.sound.stopSound();
        }
        if (this.gameMusic && this.gameMusic.components.sound) {
            this.gameMusic.components.sound.playSound();
        }
    },

    stopAllMusic: function() {
        if (this.menuMusic.components.sound) {
            this.menuMusic.components.sound.stopSound();
        }
        if (this.gameMusic.components.sound) {
            this.gameMusic.components.sound.stopSound();
        }
    },

    playLaserHit: function() {
        if (this.isLaserPlaying) return;

        this.laserSound = document.createElement('a-entity');
        this.laserSound.setAttribute('sound', {
            src: '#laser-hit',
            volume: 0.08,
            loop: true,
            positional: false,
            autoplay: true
        });
        document.querySelector('a-scene').appendChild(this.laserSound);
        this.isLaserPlaying = true;
    },

    stopLaserHit: function() {
        if (this.laserSound && this.isLaserPlaying) {
            this.laserSound.components.sound.stopSound();
            this.laserSound.parentNode.removeChild(this.laserSound);
            this.laserSound = null;
            this.isLaserPlaying = false;
        }
    },

    playExplosion: function() {
        const explosion = document.createElement('a-entity');
        explosion.setAttribute('sound', {
            src: '#explosion',
            volume: 0.2,
            positional: false,
            autoplay: true
        });
        
        explosion.addEventListener('sound-ended', () => {
            explosion.parentNode.removeChild(explosion);
        });
        
        document.querySelector('a-scene').appendChild(explosion);
    }
};
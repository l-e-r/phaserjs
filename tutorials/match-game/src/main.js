import Phaser from 'phaser';

// import scenes
import Preloader from './scenes/Preloader';
import Intro from './scenes/Intro';
import Game from './scenes/Game';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Preloader, Intro, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    }
})
import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    
    constructor () {
        super('preloader');
    }

    preload () {
        this.load.spritesheet('sokoban', 'sokoban_tilesheet.png', {
            frameWidth: 64
        })

        this.load.image('bear', 'bear.png')
        this.load.image('chicken', 'chicken.png')
        this.load.image('duck', 'duck.png')
        this.load.image('parrot', 'parrot.png')
        this.load.image('penguin', 'penguin.png')

        this.load.image('logo', 'memory_match_logo.png')
        this.load.image('start', 'start.png')


    }

    create () {

        // walk down animations
        this.anims.create({
            key: 'down-idle',
            frames: [{ key: 'sokoban', frame: 52 }]
        })

        this.anims.create({
            key: 'down-walk',
            frames: this.anims.generateFrameNumbers('sokoban', { start: 52, end: 54 }),
            frameRate: 10,
            repeat: -1
        })

        // walk up animations
        this.anims.create({
            key: 'up-idle',
            frames: [{ key: 'sokoban', frame: 55 }]
        })

        this.anims.create({
            key: 'up-walk',
            frames: this.anims.generateFrameNumbers('sokoban', { start: 55, end: 57 }),
            frameRate: 10,
            repeat: -1
        })

        // walk right animations
        this.anims.create({
            key: 'right-idle',
            frames: [{ key: 'sokoban', frame: 78 }]
        })

        this.anims.create({
            key: 'right-walk',
            frames: this.anims.generateFrameNumbers('sokoban', { start: 78, end: 80 }),
            frameRate: 10,
            repeat: -1
        })

        // walk left animations
        this.anims.create({
            key: 'left-idle',
            frames: [{ key: 'sokoban', frame: 81 }]
        })

        this.anims.create({
            key: 'left-walk',
            frames: this.anims.generateFrameNumbers('sokoban', { start: 81, end: 83 }),
            frameRate: 10,
            repeat: -1
        })

        
        this.scene.start('intro');
    }
}
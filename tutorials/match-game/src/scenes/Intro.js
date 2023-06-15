export default class Intro extends Phaser.Scene {

    constructor () {
        super('intro');
    }

    create () {

        const { width, height } = this.scale;

        this.add.sprite(width * 0.5, height * 0.5, 'logo')

        const start = this.add.sprite(width * 0.5, height * 0.85, 'start')

        start.setScale(0.15)
        start.setInteractive()
        this.input.on('gameobjectdown',this.onStartClick.bind(this));
    }

    onStartClick(pointer,gameObject)
    {
        this.scene.start('game');
    }
}

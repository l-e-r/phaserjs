import Phaser from 'phaser'

export default class Game extends Phaser.Scene {

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    boxGroup

    /** @type {Phaser.Physics.Arcade.Sprite} */
    activeBox

    constructor () {
        super('game');
    }

    init () {

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    create () {

        const { width, height } = this.scale;

        // create the player sprite
        this.player = this.physics.add.sprite(width * 0.5, height * 0.6, 'sokoban', 52)
            .setSize(40, 16)
            .setOffset(12, 38)
            .play('down-idle')

        // create a box group
        this.boxGroup = this.physics.add.staticGroup()
        this.createBoxes()

        this.physics.add.collider(this.player, this.boxGroup,  this.handlePlayerBoxCollide, undefined, this )
    }

    createBoxes () {

        const width = this.scale.width
        let xPer = 0.25
        let y = 150

        for (let row = 0; row < 3; ++row) {
            for (let col = 0; col < 3; ++col) {
                this.boxGroup.get(width * xPer, y, 'sokoban', 10)
                    .setSize(64, 32)
                    .setOffset(0, 32)
                xPer += 0.25
            }

            xPer = 0.25
            y += 150
        }
    }

    /**
     * 
     * @param {Phaser.Physics.Arcade.Sprite} player 
     * @param {Phaser.Physics.Arcade.Sprite} box 
     */
    handlePlayerBoxCollide (player, box) {

        if (this.activeBox) {
            return
        }

        this.activeBox = box

        this.activeBox.setFrame(9)

    }

    updateActiveBox() {

        if(!this.activeBox) {
            return
        }

        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.activeBox.x, this.activeBox.y
        )

        if (distance < 64) {
            return
        }

        this.activeBox.setFrame(10)
        this.activeBox = undefined

    }

    updatePlayer () {
        const speed = 200

        if (this.cursors.left.isDown) {
            this.player.setVelocity(-speed, 0)
            this.player.play('left-walk', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocity(speed, 0)
            this.player.play('right-walk', true)
        } else if (this.cursors.up.isDown) {
            this.player.setVelocity(0, -speed)
            this.player.play('up-walk', true)
        } else if (this.cursors.down.isDown) {
            this.player.setVelocity(0, speed)
            this.player.play('down-walk', true)
        } else {
            this.player.setVelocity(0, 0)
            const key = this.player.anims.currentAnim.key
            const parts = key.split('-')
            const direction = parts[0]
            this.player.play(`${direction}-idle`)
        }
    }

    update () {

        this.updatePlayer();

        this.updateActiveBox();

        this.children.each(c => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            // @ts-ignore
            const child = c

            child.setDepth(child.y)
        })
    }
}
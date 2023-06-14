import Phaser from 'phaser'

const level = [
    [1, 0, 3],
    [2, 4, 1],
    [3, 4, 2]
]


export default class Game extends Phaser.Scene {

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    boxGroup

    /** @type {Phaser.Physics.Arcade.Sprite} */
    activeBox

    /** @type {Phaser.GameObjects.Group} */
    itemsGroup

    /** @type {[{ box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite }]} */
    selectedBoxes = [{item: undefined, box: undefined}]

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

        this.itemsGroup = this.add.group()

        this.physics.add.collider(this.player, this.boxGroup,  this.handlePlayerBoxCollide, undefined, this )
    }

    createBoxes () {

        const width = this.scale.width
        let xPer = 0.25
        let y = 150

        for (let row = 0; row < level.length; ++row) {
            for (let col = 0; col < level[row].length; ++col) {
                this.boxGroup.get(width * xPer, y, 'sokoban', 10)
                    .setSize(64, 32)
                    .setOffset(0, 32)
                    .setData('itemType', level[row][col])
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

        if (box.getData('isOpen')) {
            return
        }

        if (this.activeBox) {
            return
        }

        this.activeBox = box

        this.activeBox.setFrame(9)

    }

    /**
     * 
     * @param {Phaser.Physics.Arcade.Sprite} box 
     */
    openBox (box) {

        if (!box) {
            return
        }

        const itemType = box.getData('itemType')

        /** @type {Phaser.GameObjects.Sprite} */
        let item = this.itemsGroup.get(box.x, box.y)

        switch (itemType) {
            case 0:
                item.setTexture('bear')
                break
            case 1:
                item.setTexture('chicken')
                break
            case 2:
                item.setTexture('duck')
                break
            case 3:
                item.setTexture('parrot')
                break
            case 4:
                item.setTexture('penguin')
                break
        }

        if (!item) {
            return
        }

        item.setData('noSort', true)
        box.setData('isOpen', true)
        item.setDepth(2000)

        item.scale = 0
        item.alpha = 0

        this.selectedBoxes.push({box, item})
        
        this.tweens.add({
            targets: item,
            y: '-=50',
            alpha: 1,
            scale: 0.5,
            duration: 400,
            onComplete: () => {
                if (this.selectedBoxes.length < 2) {
                    return
                }

                this.checkForMatch()
            }
        })

        this.activeBox.setFrame(10)
        this.activeBox = undefined

    }

    checkForMatch () {

        const second  = this.selectedBoxes.pop()
        const first = this.selectedBoxes.pop()

        if (first.item.texture !== second.item.texture) {
            this.tweens.add({
                targets: [first.item, second.item],
                y: '+=50',
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => {
                    first.box.setData('isOpen', false)
                    second.box.setData('isOpen', false)
                }
            })
            return
        }

        first.box.setFrame(8)
        second.box.setFrame(8)
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

        const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)

        if (spaceJustPressed && this.activeBox) {
            this.openBox(this.activeBox)
        }
    }

    update () {

        this.updatePlayer();

        this.updateActiveBox();

        this.children.each(c => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            // @ts-ignore
            const child = c

            if (!child.getData('noSort')) {
                child.setDepth(child.y)
            }
        })
    }
}
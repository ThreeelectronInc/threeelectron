let THREE = require('./../../../libs/three/three')
let { TileType } = require('./../core/tile')

class Entity {

    constructor(game, x, y, z, scale, texturePath) {
        this.image = new THREE.TextureLoader().load(texturePath)
        this.material = new THREE.SpriteMaterial( { map: this.image, color: 0xffffff } );

        this.geometry = new THREE.Sprite( this.material );
        this.geometry.scale.set(scale, scale, 1) // for later
        this.geometry.position.set(x, y, z)
        game.scene.add(this.geometry)

        this.game = game
        this.scene = game.scene

        this.vel = 0
    }

    initSpriteSheet(texture, rows, cols, animateMove) {
        this.sheet = texture
        this.sheetRows = rows
        this.sheetCols = cols

        this.animateMove = animateMove

        let rowFrac = 1 / rows
        let colFrac = 1 / cols

        this.sheet.offset.set(0, 0)
        this.sheet.repeat.set(colFrac, rowFrac)

        this.setSpriteTile = (i, j) => {
            this.sheet.offset.set(i * colFrac, j * rowFrac)
        }
    }

    move(dir) {
        let newX = this.geometry.position.x + dir.x
        let newY = this.geometry.position.y
        let newZ = this.geometry.position.z + dir.z

        let tile = this.game.getTile(newX + 0.5, newZ + 0.5)
        if (tile !== TileType.WATER && tile != TileType.ROCK) {
            this.geometry.position.set(newX, newY, newZ)

            this.animateMove(dir.normalize())

            return true
        }

        return false
    }
}

module.exports = {
    Entity: Entity,
}
let THREE = require('./../../../libs/three/three')
let { TileType } = require('./../../../survival2d/tile')

class Entity {

    constructor(game, x, y, z, geometry, scale) {

        this.geometry = geometry
        this.geometry.scale.set(scale, scale, 1) // for later
        this.geometry.position.set(x, y, z)
        game.scene.add(this.geometry)

        this.game = game
        this.scene = game.scene

        this.vel = 0
    }

    move(dir) {
        let newX = this.geometry.position.x + dir.x
        let newY = this.geometry.position.y
        let newZ = this.geometry.position.z + dir.z

        let tile = this.game.getTile(newX, newZ)
        if (tile !== TileType.WATER && tile != TileType.ROCK) {
            this.geometry.position.set(newX, newY, newZ)
        }
    }
}

module.exports = {
    Entity: Entity,
}
let THREE = require('./../../../libs/three/three')

let ChunkClass = require('./../chunk')

let WORLD = require('./../world').Instance

class Entity {

    constructor(scene, x, y, z, geometry, scale) {

        this.geometry = geometry
        this.geometry.scale.set(scale, scale, 1) // for later
        this.geometry.position.set(x, y, z)
        scene.add(this.geometry)

        this.scene = scene

        this.vel = 0
    }

    move(dir) {
        let newX = this.geometry.position.x + dir.x
        let newY = this.geometry.position.y + dir.y
        let newZ = this.geometry.position.z + dir.z

        if (!WORLD.getBlock(Math.floor(newX / ChunkClass.blockScale) | 0, Math.floor(newY / ChunkClass.blockScale) | 0, Math.floor(newZ / ChunkClass.blockScale) | 0)) {
            this.geometry.position.set(newX, newY, newZ)
        }
    }
}

module.exports = {
    Entity: Entity,
}
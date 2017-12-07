let THREE = require('./../../../libs/three/three')

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
        let newY = this.geometry.position.y
        let newZ = this.geometry.position.z + dir.z

        this.geometry.position.set(newX, newY, newZ)
    }
}

module.exports = {
    Entity: Entity,
}
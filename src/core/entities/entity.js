let THREE = require('./../../libs/three/three')

let { BaseGame } = require('./../base_game')
let TerrainGenerator = require('./../terrain_generator')
let ChunkClass = require('./../chunk')

let mapChicken = new THREE.TextureLoader().load( "assets/chicken.png" );
let matChicken = new THREE.SpriteMaterial( { map: mapChicken, color: 0xffffff } );
let geomChicken =  new THREE.Sprite( matChicken );
let WORLD = require('./../world').Instance

class Entity {

    constructor(scene,x,y,z) {
        this.chickenScale = ChunkClass.blockScale // * 10

        this.chicken = geomChicken.clone()
        this.chicken.scale.set(this.chickenScale, this.chickenScale, 1)
        //chicken.position.set(x * chunkClass.blockScale,  chickenScale + (TerrainGenerator.world.waterLevel - 1) * chunkClass.blockScale, z*chunkClass.blockScale)
        this.chicken.position.set(x, y, z)
        scene.add(this.chicken);
        console.log('Adding chicken: ', this.chicken.position)
        module.exports.chickenCount++

        this.vel = 0
    }
    
    update(delta) {
        this.vel -= 0.2 * delta

        this.move(0, this.vel, 0)
    }

    move(x,y,z) {
        let newX = this.chicken.position.x + x
        let newY = this.chicken.position.y + y
        let newZ = this.chicken.position.z + z

        if (!WORLD.getBlock(Math.floor(newX / ChunkClass.blockScale) | 0, Math.floor(newY / ChunkClass.blockScale) | 0, Math.floor(newZ / ChunkClass.blockScale) | 0)) {
            this.chicken.position.set(newX, newY, newZ)
        }
    }
}



module.exports = {
    Entity: Entity,
    chickenCount: 0
}
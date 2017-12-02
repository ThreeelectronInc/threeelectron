let THREE = require('./../../libs/three/three')

let { BaseGame } = require('./../base_game')
let TerrainGenerator = require('./../terrain_generator')
let ChunkClass = require('./../chunk')

let mapChicken = new THREE.TextureLoader().load( "assets/chicken.png" );
let matChicken = new THREE.SpriteMaterial( { map: mapChicken, color: 0xffffff } );

let geomChicken =  new THREE.Sprite( matChicken );

// let allChickens = new THREE.Scene();

class Entity {

    constructor(scene,x,y,z) {
        this.chickenScale = ChunkClass.blockScale // * 10

        this.chicken = geomChicken.clone() //new THREE.Sprite( matChicken );
        this.chicken.scale.set(this.chickenScale, this.chickenScale, 1)
        //chicken.position.set(x * chunkClass.blockScale,  chickenScale + (TerrainGenerator.world.waterLevel - 1) * chunkClass.blockScale, z*chunkClass.blockScale)
        this.chicken.position.set(x, y, z)
        scene.add(this.chicken);
        // console.log('Adding chicken: ', this.chicken.position)
        module.exports.chickenCount++

        this.vel = 0
    }
    
    update(delta) {
        this.vel += 5 * delta
        // this.chicken.position.y += delta * this.vel
    }
}



module.exports = {
    Entity: Entity,
    chickenCount: 0
}
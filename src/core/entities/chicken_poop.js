let THREE = require('./../../libs/three/three')

let { Entity } = require('./entity')

let mapPoop = new THREE.TextureLoader().load( "assets/images/poop/chicken_poop.png" );
let matPoop = new THREE.SpriteMaterial( { map: mapPoop, color: 0xffffff } );
let geomPoop =  new THREE.Sprite( matPoop );

let ChunkClass = require('./../chunk')
let WORLD = require('./../world').Instance

class ChickenPoop extends Entity {

    constructor(scene, x, y, z) {
        super(scene, x, y, z, geomPoop.clone(), ChunkClass.blockScale * 0.2)
    }
    
    update(delta) {
        this.vel -= 0.2 * delta

        this.move(0, this.vel, 0)
    }
}

module.exports = {
    ChickenPoop: ChickenPoop,
}
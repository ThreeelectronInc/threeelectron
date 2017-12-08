let THREE = require('./../../../libs/three/three')

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
        let down = new THREE.Vector3(0, -0.8, 0)

        this.move(down)
    }
}

module.exports = {
    ChickenPoop: ChickenPoop,
}
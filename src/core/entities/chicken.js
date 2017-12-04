let THREE = require('./../../libs/three/three')

let { Entity } = require('./entity')

let mapChicken = new THREE.TextureLoader().load( "assets/chicken.png" );
let matChicken = new THREE.SpriteMaterial( { map: mapChicken, color: 0xffffff } );
let geomChicken =  new THREE.Sprite( matChicken );

let ChunkClass = require('./../chunk')
let WORLD = require('./../world').Instance

let { ChickenPoop } = require('./chicken_poop')

class Chicken extends Entity {

    constructor(scene, x, y, z) {
        super(scene, x, y, z, geomChicken.clone(), ChunkClass.blockScale)
        module.exports.chickenCount++
        console.log("adding chicken!!!", x, y, z)
    }
    
    update(delta) {
        this.vel -= 0.2 * delta

        this.move(0, this.vel, 0)

        this.poop_update(delta)
    }

    poop_update (delta) {
        this.poop.update(delta)
    }

    poop() {
        this.poop = new ChickenPoop(this.scene,
            this.geometry.position.x,
            this.geometry.position.y - 10, 
            this.geometry.position.z)
    }
}

module.exports = {
    Chicken: Chicken,
    chickenCount: 0
}
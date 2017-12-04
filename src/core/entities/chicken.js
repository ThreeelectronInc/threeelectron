let THREE = require('./../../libs/three/three')

let { Entity } = require('./entity')

let mapChicken = new THREE.TextureLoader().load( "assets/chicken.png" );
let matChicken = new THREE.SpriteMaterial( { map: mapChicken, color: 0xffffff } );
let geomChicken =  new THREE.Sprite( matChicken );
let WORLD = require('./../world').Instance

class Chicken extends Entity {

    constructor(scene, x, y, z) {
        super(scene, x, y, z, geomChicken)
        module.exports.chickenCount++
        console.log("adding chicken!!!", x, y, z)
    }
    
    update(delta) {
        this.vel -= 0.2 * delta

        this.move(0, this.vel, 0)
    }
}

module.exports = {
    Chicken: Chicken,
    chickenCount: 0
}
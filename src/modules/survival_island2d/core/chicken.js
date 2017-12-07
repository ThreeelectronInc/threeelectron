let THREE = require('./../../../libs/three/three')

let { Entity } = require('./entity')

let mapChicken = new THREE.TextureLoader().load( "assets/chicken.png" );
let matChicken = new THREE.SpriteMaterial( { map: mapChicken, color: 0xffffff } );
let geomChicken =  new THREE.Sprite( matChicken );

class Chicken extends Entity {

    constructor(scene, x, y, z) {
        super(scene, x, y, z, geomChicken.clone(), 0.3)
        module.exports.chickenCount++

        this.randomOffset = new THREE.Vector3(Math.random() * 2 -1, 0, Math.random() * 2 -1)
        this.randomOffset.multiplyScalar(10)
        this.randomOffset.add(this.geometry.position)
    }
    
    update(delta) {
        let dirVec = new THREE.Vector3(0,0,0)
        dirVec.subVectors(this.randomOffset, this.geometry.position)
        dirVec.normalize()
        dirVec.multiplyScalar(1 * delta)

        this.move(dirVec)
    }
}

module.exports = {
    Chicken: Chicken,
    chickenCount: 0
}
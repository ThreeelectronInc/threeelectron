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

        this.randomOffset = new THREE.Vector3(Math.random() * 2 -1, 0, Math.random() * 2 -1)
        this.randomOffset.multiplyScalar(50)
        this.randomOffset.add(this.geometry.position)
    }
    
    update(delta) {
        this.poop_update(delta)

        let dirVec = new THREE.Vector3(0,0,0)
        dirVec.subVectors(this.randomOffset, this.geometry.position)
        dirVec.normalize()
        dirVec.multiplyScalar(1 * delta)
        let down = new THREE.Vector3(0,-3,0)
        down.multiplyScalar(delta * 15)
        dirVec.add(down)

        this.move(dirVec)
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
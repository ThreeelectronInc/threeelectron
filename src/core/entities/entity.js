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

        this.randomOffset = new THREE.Vector3(Math.random() * 2 -1, 0, Math.random() * 2 -1)
        this.randomOffset.multiplyScalar(50)
        this.randomOffset.add(this.chicken.position)
        console.log(this.randomOffset)
    }
    
    update(delta) {
        //let dirVec = this.targetPosition.sub(this.chicken.position)
       // dirVec.add(new THREE.Vector3(0, -1, 0)).multiplyScalar(0.1 * delta)
        let dirVec = new THREE.Vector3(0,0,0)
        dirVec.subVectors(this.randomOffset, this.chicken.position)

        //this.randomOffset.sub(this.chicken.position)
        dirVec.normalize()
        dirVec.multiplyScalar(1 * delta)
        let down = new THREE.Vector3(0,-1,0)
        down.multiplyScalar(delta * 15)
        dirVec.add(down)

        this.move(dirVec)
        
    }

    move(dir) {
        let newX = this.chicken.position.x + dir.x
        let newY = this.chicken.position.y + dir.y
        let newZ = this.chicken.position.z + dir.z

        if (!WORLD.getBlock(Math.floor(newX / ChunkClass.blockScale) | 0, Math.floor(newY / ChunkClass.blockScale) | 0, Math.floor(newZ / ChunkClass.blockScale) | 0)) {
            this.chicken.position.set(newX, newY, newZ)
        }
        else {
            if (!WORLD.getBlock(Math.floor(newX / ChunkClass.blockScale) | 0, 0, Math.floor(newZ / ChunkClass.blockScale) | 0)) {
                this.chicken.position.set(newX, 0, newZ)
            } 
        }
    }
}



module.exports = {
    Entity: Entity,
    chickenCount: 0,
    geomChicken
}
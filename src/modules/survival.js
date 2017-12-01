let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let entityClass = require('./../core/entities/entity')

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.rotYOffset = 0
        this.radiusOffset = 1000
        this.heightOffset = 1000

        this.lookPos = new THREE.Vector3()

        this.chickenCount = 0
        this.chickensDone = false
    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")


        TerrainGenerator.generateTerrain(this.scene)
        console.log('moving on while terrain generates')
        // console.log(chicken.position)

        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(100,500,100)
        this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        console.log(this.lookPos)

        this.chickens = []
    }

    deInit() {
    }

    update(delta) {

        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        if (keyD("w")) { this.radiusOffset -= camVel }
        if (keyD("s")) { this.radiusOffset += camVel }
        if (keyD("a")) { this.rotYOffset += camVel * 0.005 }
        if (keyD("d")) { this.rotYOffset -= camVel * 0.005 }

        if (keyD("e")) { this.heightOffset += camVel }
        if (keyD("q")) { this.heightOffset -= camVel }


        if (this.isMouseDown[0]) {
          this.rotYOffset -= this.mouse.xVel * 0.01
          this.heightOffset -= this.mouse.yVel * 5
        }
        else{ // rotate slowly
            // this.rotYOffset = this.rotYOffset + delta * 0.1
        }


        this.radiusOffset -= 0.25 * this.mouse.wheel

        this.radiusOffset = Math.max(this.radiusOffset, 0.01)

        this.camera.position.set(this.radiusOffset * Math.cos(this.rotYOffset), Math.sin(this.rotYOffset) * 50 + this.heightOffset, this.radiusOffset * Math.sin(this.rotYOffset));        
        this.camera.position.add(this.lookPos)
        this.camera.lookAt(this.lookPos);


        if (TerrainGenerator.world.done && !this.chickensDone){
            console.log("start generating chickens")
            
            for (let x = 0; x < TerrainGenerator.world.totalWidth; x++){

                for (let z = 0; z < TerrainGenerator.world.totalDepth; z++){
                    
                    if ( !this.chickensDone && TerrainGenerator.world.getChunk(x,TerrainGenerator.world.waterLevel,z)) {
                        let chicken = new entityClass.Entity(this.scene, x * chunkClass.blockScale,  chunkClass.blockScale + (TerrainGenerator.world.waterLevel - 1) * chunkClass.blockScale, z * chunkClass.blockScale)
                        this.chickens.push(chicken)
                    }

                    console.log('chicken count: ', entityClass.chickenCount)

                    if (entityClass.chickenCount > 200){
                        this.chickensDone = true
                        break;
                    }

                }

                if (this.chickensDone) {
                    break
                }
            }
        }
        
        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].update(delta)
        }

    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
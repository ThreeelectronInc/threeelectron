let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.rotYOffset = 0
        this.radiusOffset = 500
        this.heightOffset = 1000

        this.lookPos = new THREE.Vector3()
    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")


        TerrainGenerator.generateTerrain(this.scene)
        console.log('moving on while terrain generates')

        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(100,500,100)
        this.lookPos.set(TerrainGenerator.world.totalWidth * 0.5, 0, TerrainGenerator.world.totalDepth * 0.5)
        console.log(this.lookPos)
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
          this.heightOffset -= this.mouse.yVel
        }
        else{
            this.rotYOffset = this.rotYOffset + delta * 0.1
        }


        this.radiusOffset -= 0.25 * this.mouse.wheel

        this.radiusOffset = Math.max(this.radiusOffset, 0.01)

        this.camera.position.set(this.radiusOffset * Math.cos(this.rotYOffset), Math.sin(this.rotYOffset) * 50 + this.heightOffset, this.radiusOffset * Math.sin(this.rotYOffset));        
        this.camera.position.add(this.lookPos)
        this.camera.lookAt(this.lookPos);


    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

class SurvivalGame extends BaseGame {

    constructor(tagName) {
        super(tagName)

        this.camSpeed = 500
        this.rotYOffset = 0
        this.radiusOffset = 500
        this.heightOffset = 500

        this.lookPos = new THREE.Vector3()
    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")

        this.camera.position.set(100,500,100)

        TerrainGenerator.generateTerrain(this.scene);
    }

    deInit() {
    }

    update(delta) {


        let { camera, camSpeed, radiusOffset, rotYOffset, heightOffset } = this




        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)


        if (keyD("w")) { this.radiusOffset -= camSpeed * delta }
        if (keyD("s")) { this.radiusOffset += camSpeed * delta }
        if (keyD("a")) { this.rotYOffset += camSpeed * 0.005 * delta }
        if (keyD("d")) { this.rotYOffset -= camSpeed * 0.005 * delta }

        if (keyD("e")) { this.heightOffset += camSpeed * delta }
        if (keyD("q")) { this.heightOffset -= camSpeed * delta }


        if (this.isMouseDown[0]) {

        //   const camSpeed = 0.5

          this.rotYOffset -= this.mouse.xVel * 0.005  * camSpeed * delta
          this.radiusOffset -= this.mouse.yVel * camSpeed * delta

        }

        // let zoomMouseSpeed = 0.25 * this.mouse.wheel

        // this.zoom(zoomMouseSpeed)



        this.rotYOffset = this.rotYOffset + delta * 0.1
        camera.position.set(radiusOffset * Math.cos(rotYOffset), Math.sin(rotYOffset) * 50 + heightOffset, radiusOffset * Math.sin(rotYOffset));        
        camera.lookAt(this.lookPos);


    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
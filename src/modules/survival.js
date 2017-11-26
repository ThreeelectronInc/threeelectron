let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

class SurvivalGame extends BaseGame {

    constructor(tagName) {
        super(tagName)



        this.cam_speed = 500

        this.pos_offset = 0
        this.camera_offset = 500
        this.height_offset = 500
    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")

        TerrainGenerator.generateTerrain(this.scene);
    }

    deInit() {
    }

    update(delta) {


        let { camera, cam_speed, camera_offset, pos_offset, height_offset } = this




        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)


        if (keyD("w")) { this.camera_offset -= cam_speed * delta }
        if (keyD("s")) { this.camera_offset += cam_speed * delta }
        if (keyD("a")) { pos_offset += cam_speed * 0.005 * delta }
        if (keyD("d")) { pos_offset -= cam_speed * 0.005 * delta }

        if (keyD("e")) { this.height_offset += cam_speed * delta }
        if (keyD("q")) { this.height_offset -= cam_speed * delta }


        // if (this.isMouseDown[0]) {

        //   const camSpeed = 0.5

        //   this.camera.position.x -= this.mouse.xVel * camSpeed
        //   this.camera.position.y += this.mouse.yVel * camSpeed

        // }

        // let zoomMouseSpeed = 0.25 * this.mouse.wheel

        // this.zoom(zoomMouseSpeed)



        this.pos_offset = pos_offset + delta * 0.1
        camera.position.set(camera_offset * Math.cos(pos_offset), Math.sin(pos_offset) * 50 + height_offset, camera_offset * Math.sin(pos_offset));
        camera.up = new THREE.Vector3(0, 1, 0);
        camera.lookAt(new THREE.Vector3(0, 0, 0));


    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
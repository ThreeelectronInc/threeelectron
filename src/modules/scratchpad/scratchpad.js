/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../../libs/three/three')

let BaseGame = require('./../../core/base_game')

let DeityCamera = require('./../../core/camera/deity')

let { ipcRenderer, remote } = require('electron');


class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

    }


    // Called when start() is called and the renderer has been initialised
    init() {

        this.cameraControl = new DeityCamera(this.camera,
            (key) => this.keyDown(key),
            this.mouse)

            this.camera.position.z = 1000


        let mapChicken = new THREE.TextureLoader().load("assets/chicken.png");
        let matChicken = new THREE.SpriteMaterial({ map: mapChicken, color: 0xffffff });
        let geomChicken = new THREE.Sprite(matChicken);

        geomChicken.scale.x = 500
        geomChicken.scale.y = 500
        
        this.scene.add(geomChicken)
    }

    deInit() {
    }

    update(delta) {

        this.cameraControl.update(delta)
    }


    onWindowResize() {
        let { camera, renderer } = this
    }

}

module.exports = SurvivalGame
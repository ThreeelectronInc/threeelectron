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

        this.assetDirectory = 'assets'
        this.assets = {}

    }


    // Called when start() is called and the renderer has been initialised
    init() {

      this.cameraControl = new DeityCamera(
        this.camera,
        (key) => this.keyDown(key),
        this.mouse
      )

      this.camera.position.z = 1000


      this.initEntity('bee', {posX: 1000})
      this.initEntity('bee')

    }

    deInit() {
    }

    update(delta) {

      this.cameraControl.update(delta)
    }


    onWindowResize() {
      let { camera, renderer } = this
    }


    isDefined(prop){
      return prop !== undefined
    }

    // Custom methods
    initEntity(name, props = {}){

      if (this.assets[name] === undefined){
        console.log(`Generating new asset for ${name}...`)
        let asset = {}

        asset.texture = new THREE.TextureLoader().load(`${this.assetDirectory}/${name}.png`)

        asset.material = new THREE.MeshBasicMaterial({
            map: asset.texture,
            color: 0xffffff,
            transparent: true,
        })

        asset.geometry = new THREE.PlaneGeometry(1, 1, 1)

        this.assets[name] = asset
      }

      let mesh = new THREE.Mesh(
        this.assets[name].geometry,
        this.assets[name].material
      )

      mesh.scale.x = props.scaleX === undefined ? 500 : props.scaleX
      mesh.scale.y =  props.scaleY === undefined ? 500 : props.scaleY

      mesh.position.x =  props.posX === undefined ? 0 : props.posX
      mesh.position.y =  props.posY === undefined ? 0 : props.posY

      this.scene.add(mesh)
    }

}

module.exports = SurvivalGame

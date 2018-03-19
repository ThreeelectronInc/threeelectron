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
        this.mouse,
        5 // camera velocity in units/second
      )

      this.camera.position.y = 2.5
      this.camera.position.z = 5

      this.initEntity('bee', {posX: 1})
      this.initEntity('bee')
      this.initEntity('skull', {posY: 1})
      this.initEntity('chicken', {posX: -1})
      this.initEntity('chicken', {posY: -1})

      // TODO: add gui to create and move objects

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
            side: THREE.DoubleSide,
        })

        asset.geometry = new THREE.PlaneGeometry(1, 1, 1)
        // asset.geometry.rotateX(Math.PI / 2)

        // let tmpBufGeom = new THREE.PlaneBufferGeometry(1, 1)
        // tmpBufGeom.rotateX(Math.PI / 2)
        // // tmpBufGeom.translate(blockScale / 2, 0, 0)
        // asset.geometry = new THREE.Geometry().fromBufferGeometry(tmpBufGeom)


        this.assets[name] = asset
      }

      let mesh = new THREE.Mesh(
        this.assets[name].geometry,
        this.assets[name].material
      )

      mesh.scale.x = props.scaleX === undefined ? 1 : props.scaleX
      mesh.scale.y =  props.scaleY === undefined ? 1 : props.scaleY

      mesh.position.x =  props.posX === undefined ? 0 : props.posX
      mesh.position.z =  props.posY === undefined ? 0 : props.posY

      mesh.rotateX(-Math.PI / 2)

      this.scene.add(mesh)
    }

}

module.exports = SurvivalGame


// This will replace the default react app overlaying the game

// import CustomButton from './components/custom_button.js'
let CustomButton = require('./../../components/custom_button')
window.onload = function () {
    class Greetings extends React.Component {
        render() {
            return React.createElement(
                'div', // Type
                null, // Props
                `Hi there, ${this.props.name}!`, // Body (optional),
                React.createElement('br'),
                React.createElement(CustomButton, {name: 'Someone'})
            )
        }
    }
    ReactDOM.render(
        React.createElement(
            Greetings,
            { name: 'Alex' }
        ),
        document.getElementById('reactApp')
    );
};

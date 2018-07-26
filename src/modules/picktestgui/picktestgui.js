/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let BaseGame = require('./../../core/base_game')

let DeityCamera = require('./../../core/camera/deity')
let CustomButton = require('./../../components/custom_button')

let { ipcRenderer, remote } = require('electron');

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.assetDirectory = 'assets'
        this.assets = {}

        this.currentIntersects = ''

        this.counter = 0

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

        this.initEntity('bee')
        this.initEntity('skull', { posY: 1 })
        this.initEntity('chicken', { posX: -1 })
        this.initEntity('chicken', { posY: -1 })

    }

    deInit() {
    }

    checkForIntersects() {

        let intersects = this.raySelect()

        let intersectsString = 'None'

        if (intersects.length > 0) {
            intersectsString = intersects.reduce(
                (acc, item) => {
                    return acc + item.object.name + ', '
                },
                '',
            )
        }

        if (this.currentIntersects !== intersectsString){
            this.currentIntersects = intersectsString
            this.counter++
            this.reactHandle.forceUpdate()
        }


    }


    update(delta) {
        this.cameraControl.update(delta)
    }

    onWindowResize() {
        let { camera, renderer } = this
    }


    onMouseMove(event) {
        this.checkForIntersects()
    }

    gui(guiHandle) {

        this.reactHandle = guiHandle // Get handle to gui to force redraws elsewhere

        return React.createElement(
            'div',
            {},
            `Greetings`, // Body (optional),
            React.createElement('br'),
            React.createElement(
                CustomButton,
                {
                    name: 'Spawn bee',
                    onClick: () => this.initEntity('bee', { posX: 1 })
                }
            ),
            React.createElement(
                CustomButton,
                {
                    name: 'Force redraw gui',
                    onClick: () => { this.counter++ ; guiHandle.forceUpdate()}
                }
            ),
            React.createElement(
                'div',
                null,
                `Forced GUI updates: ${this.counter}`,
            ),
            React.createElement(
                'div',
                null,
                `Mouse ray intersects: ${this.currentIntersects}`,
            ),

        )
    }


    // Custom methods
    initEntity(name, props = {}) {

        if (this.assets[name] === undefined) {
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

            this.assets[name] = asset
        }

        let mesh = new THREE.Mesh(
            this.assets[name].geometry,
            this.assets[name].material
        )

        mesh.scale.x = props.scaleX === undefined ? 1 : props.scaleX
        mesh.scale.y = props.scaleY === undefined ? 1 : props.scaleY

        mesh.position.x = props.posX === undefined ? 0 : props.posX
        mesh.position.z = props.posY === undefined ? 0 : props.posY

        //   mesh.rotateX(-Math.PI / 2)

        mesh.name = name // required for picking
        this.scene.add(mesh)
    }



}

module.exports = SurvivalGame


/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../../libs/three/three')

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
        this.planeGeometry = new THREE.PlaneGeometry(1, 1, 1)

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
        // this.cameraControl.update(1)

        this.initEntity('bee')
        this.initEntity('skull', { posZ: 1 })
        this.initEntity('chicken', { posX: -1 })
        this.initEntity('chicken', { posZ: -1 })

        this.makeFloor('grass', {posY: -0.5})


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

        if (this.currentIntersects !== intersectsString) {
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


    onMouseDown(event) {
        // console.log(event.button === 0)
        if (event.button === 0) {
            this.checkForIntersects()
        }

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
                    onClick: () => { this.counter++; guiHandle.forceUpdate() }
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
                `Mouse ray intersected on click: ${this.currentIntersects}`,
            ),

        )
    }



    getMaterial(name) {

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

            this.assets[name] = asset
        }
    }


    // Custom methods
    initEntity(name, props = {}) {

        this.getMaterial(name)

        let mesh = new THREE.Mesh(
            this.planeGeometry,
            this.assets[name].material
        )

        this.scene.add(mesh)

        let prop = (name, defaultValue) => props[name] === undefined ? defaultValue : props[name]
        
        mesh.scale.x = prop('scaleX', 1)
        mesh.scale.y = prop('scaleY', 1)
        mesh.scale.z = prop('scaleZ', 1)

        mesh.position.x = prop('posX', 0)
        mesh.position.y = prop('posY', 0)
        mesh.position.z = prop('posZ', 0)

        mesh.name = name // required for picking
        return mesh
    }


    makeFloor(name, props = {}) {
        let floor = this.initEntity(name, props)

        floor.rotateX(-Math.PI / 2)
        return floor
    }


}

module.exports = SurvivalGame


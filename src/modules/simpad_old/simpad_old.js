/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let BaseGame = require('./../../core/base_game')

let SimCamera = require('./../../core/camera/sim')
let CustomButton = require('./../../components/custom_button')

let { ipcRenderer, remote } = require('electron');

let { makeTextSprite } = require('./utils.js')
/*

NOTES

4x/sim/roguelike/rpg

All keyboard driven, no mouse if possible

WASD : camera movement
QE : camera rotation

UIOP : 1-4
JKL; : 5-8


Replace the sprite lables with html overlay elements in 
    react now that we know how to project from 3D to 2D.

Dynamically measure and change font size based on character count.
*/

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


        this.sceneOrtho = new THREE.Scene();

        this.cameraControl = new SimCamera(
            this.camera,
            (key) => this.keyDown(key),
            this.mouse,
            15 // camera velocity in units/second
        )

        this.camera.position.y = 10
        this.camera.position.z = 3
        // this.cameraControl.update(1)

        this.initEntity('bee')
        this.overlayTest = this.initEntity('skull', { posZ: 3 })
        this.initEntity('chicken', { posX: -3, name: 'chicken 1' })
        this.initEntity('chicken', { posZ: -3 })

        this.makeFloor()

        var width = window.innerWidth;
        var height = window.innerHeight;
        this.cameraOrtho = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 1, 10.1);
        this.cameraOrtho.position.z = 10;



        let sprite = new THREE.TextSprite({
            textSize: 10,
            redrawInterval: 250,
            texture: {
              text: 'Carpe Diem',
              fontFamily: 'Arial, Helvetica, sans-serif',
            },
            material: {
              color: 0xffbbff,
              fog: true,
            },
          });
          this.scene.add(sprite);

    }

    deInit() {
    }


    update(delta) {
        this.cameraControl.update(delta)

        // Update label positions
        this.sceneOrtho.traverse((label) => {

            if (label.hasOwnProperty('attachedToEntity')) {

                var pos3Dto2D = new THREE.Vector3(label.attachedToEntity.position.x, label.attachedToEntity.position.y, label.attachedToEntity.position.z)

                pos3Dto2D.project(this.camera)
                label.position.set(window.innerWidth * pos3Dto2D.x * 0.5, window.innerHeight * pos3Dto2D.y * 0.5, 5)

                // document.getElementById("testlabel").style.left = window.innerWidth * pos3Dto2D.x * 0.5+"px";
                // document.getElementById("testlabel").style.top = window.innerWidth * pos3Dto2D.y * 0.5+"px";

                if (this.testLabel !== undefined) {
                    // console.log(this.testLabel)

                    // this.testLabel.props.style.left = window.innerWidth * pos3Dto2D.x * 0.5+"px"

                }
            }

        })

    }

    postRender(delta) {
        // renderer.clear();
        // renderer.render( scene, camera );
        this.renderer.clearDepth();
        this.renderer.render(this.sceneOrtho, this.cameraOrtho);
    }

    onWindowResize() {
        let { camera, renderer } = this
    }


    onMouseDown(event) {
        // console.log(event.button === 0)
        if (event.button === 0) {
            // this.checkForIntersects()
        }

    }

    gui(guiHandle) {

        this.reactHandle = guiHandle // Get handle to gui to force redraws elsewhere

        this.testLabel = React.createElement('div', { id: 'testlabel', style: { position: 'absolute' } })

        this.hudHandle = React.createElement(
            'div',
            {},
            React.createElement(
                CustomButton,
                {
                    name: 'Force redraw gui',
                    onClick: () => { this.counter++; guiHandle.forceUpdate() }
                }
            ),
            this.testLabel

        )

        return this.hudHandle
    }


    getMeshMaterial(name) {

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

    getSpriteMaterial(name) {

        if (this.assets[name] === undefined) {
            console.log(`Generating new assqA   et for ${name}...`)
            let asset = {}

            asset.texture = new THREE.TextureLoader().load(`${this.assetDirectory}/${name}.png`)

            asset.material = new THREE.SpriteMaterial({
                map: asset.texture,
                color: 0xffffff,
                transparent: true,
                // side: THREE.DoubleSide,
            })

            this.assets[name] = asset
        }
    }

    initFloor(name, props = {}) {
        this.getMeshMaterial(name)

        let mesh = new THREE.Mesh(
            this.planeGeometry,
            this.assets[name].material
        )


        let prop = (name, defaultValue) => props[name] === undefined ? defaultValue : props[name]

        mesh.scale.x = prop('scaleX', 1)
        mesh.scale.y = prop('scaleY', 1)
        mesh.scale.z = prop('scaleZ', 1)

        mesh.position.x = prop('posX', 0)
        mesh.position.y = prop('posY', 0)
        mesh.position.z = prop('posZ', 0)


        this.scene.add(mesh)
        return mesh
    }


    // Custom methods
    initEntity(name, props = {}) {

        let group = new THREE.Group()

        let prop = (name, defaultValue) => props[name] === undefined ? defaultValue : props[name]

        group.scale.x = prop('scaleX', 1)
        group.scale.y = prop('scaleY', 1)
        group.scale.z = prop('scaleZ', 1)

        group.position.x = prop('posX', 0)
        group.position.y = prop('posY', 0)
        group.position.z = prop('posZ', 0)

        let showName = prop('showName', true)

        let displayName = prop('name', name)


        this.getSpriteMaterial(name)

        let mesh = new THREE.Sprite(this.assets[name].material)

        let text = displayName
        while (text.length < 12) text += ' ' // right pad

        let label = makeTextSprite(text)

        label.visible = showName

        label.attachedToEntity = group

        group.add(mesh)
        this.scene.add(group)

        this.sceneOrtho.add(label)

        label.center.set(0.5, 0.5)//0.75)//0.5 );
        label.scale.set(100, 100, 1);


        group.name = name // required for picking

        return group
    }


    makeFloor(name, props = {}) {

        let radius = 5

        for (let x = -radius; x < radius + 1; x++) {
            for (let z = -radius; z < radius + 1; z++) {

                let floor = this.initFloor('grass', { posY: -0.5, posX: x, posZ: z })

                floor.rotateX(-Math.PI / 2)
            }
        }
    }


}

module.exports = SurvivalGame


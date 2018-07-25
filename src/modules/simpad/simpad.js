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


/*

NOTES

4x/sim/roguelike/rpg

All keyboard driven, no mouse if possible

WASD : camera movement
QE : camera rotation

UIOP : 1-4
JKL; : 5-8


*/

let roundRect = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }
let makeTextSprite = (message, parameters) => {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 14;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 2;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 0.5 };
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
    var sprite = new THREE.Sprite(spriteMaterial);
    let scale = { x: 0.25 * fontsize, y: 0.125 * fontsize }
    // let scale = {x: 1, y: 1, z: 1}
    // sprite.center.set( 0.5, 0.5, 0 );
    sprite.scale.set(scale.x, scale.y, 1)//, scale.z);

    return sprite;
}

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
        this.overlayTest = this.initEntity('skull', { posZ: 1, showName: true })
        this.initEntity('chicken', { posX: -1, name: 'chicken 1', showName: true })
        this.initEntity('chicken', { posZ: -1 })

        this.makeFloor('grass', { posY: -0.5 })


        var width = window.innerWidth;
        var height = window.innerHeight;
        this.cameraOrtho = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 1, 10.1);
        this.cameraOrtho.position.z = 10;

    }

    deInit() {
    }


    update(delta) {
        this.cameraControl.update(delta)

        // Update label positions
        this.sceneOrtho.traverse((label) => {
            // if (object instanceof THREE.Particle) {
            //     if (object.name === 'q10')
            // // do what you want with it.

            if (label.hasOwnProperty('attachedToEntity')) {
                // console.log(label.attachedToEntity.name)

                var pos3Dto2D = new THREE.Vector3(label.attachedToEntity.position.x, label.attachedToEntity.position.y, label.attachedToEntity.position.z)

                pos3Dto2D.project(this.camera)
                label.position.set(window.innerWidth * pos3Dto2D.x * 0.5, window.innerHeight * pos3Dto2D.y * 0.5, 5)
            }

        })

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

        return React.createElement(
            'div',
            {},
            React.createElement(
                CustomButton,
                {
                    name: 'Force redraw gui',
                    onClick: () => { this.counter++; guiHandle.forceUpdate() }
                }
            ),

        )
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
            console.log(`Generating new asset for ${name}...`)
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

        let showName = prop('showName', false)

        let displayName = prop('name', name)


        this.getSpriteMaterial(name)

        // let mesh = new THREE.Mesh(
        //     this.planeGeometry,
        //     this.assets[name].material
        // )

        let mesh = new THREE.Sprite(this.assets[name].material)

        let text = displayName
        while (text.length < 30) text += ' ' // right pad

        let label = makeTextSprite(text)

        label.visible = showName

        label.attachedToEntity = group

        group.add(mesh)
        this.scene.add(group)

        this.sceneOrtho.add(label)

        label.center.set(0.5, 0.75)//0.5 );
        label.scale.set(200, 200, 1);


        group.name = name // required for picking

        return group
    }


    makeFloor(name, props = {}) {
        let floor = this.initFloor(name, props)

        floor.rotateX(-Math.PI / 2)
        return floor
    }


}

module.exports = SurvivalGame


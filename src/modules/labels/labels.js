/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../../libs/three/three')
// global.THREE = require('./../../libs/three/three')
// let text2d = require('./../../libs/three/three-text2d/three-text2d.js')
// import { MeshText2D, textAlign } from './../../libs/three/three-text2d/three-text2d.js'

let BaseGame = require('./../../core/base_game')

let DeityCamera = require('./../../core/camera/deity')
let CustomButton = require('./../../components/custom_button')

let { ipcRenderer, remote } = require('electron');


let roundRect = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }
let makeTextSprite = ( message, parameters ) =>
{
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 14;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 2;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:0.5 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    let scale = {x: 0.25 * fontsize, y: 0.125 * fontsize}
    // let scale = {x: 1, y: 1, z: 1}
    // sprite.center.set( 0.5, 0.5, 0 );
    sprite.scale.set(scale.x, scale.y, 1)//, scale.z);
    

    // sprite.center.set( 0.5, 0.0, 0 );
    // sprite.scale.set(scale.x * 0.5, scale.y * 0.5, 1)//, scale.z);

    // sprite.scale.set(0.002 * canvas.width, 0.0025 * canvas.height);
    // sprite.position.set(scale.x * 0.25, 0, 0 )//, scale.y * 0.5, scale.z * 0.5)
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

        this.makeFloor('grass', {posY: -0.5})


        this.sceneOrtho = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;
        this.cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10.1 );
        this.cameraOrtho.position.z = 10;



        let label = makeTextSprite("This should float over the skull")
        this.sceneOrtho.add(label)

        label.center.set( 0.5, 0.75)//0.5 );
        label.scale.set( 200, 200, 1 );

        this.labelTest = label

        // http://zachberry.com/blog/tracking-3d-objects-in-2d-with-three-js/

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


        var pos3Dto2D = new THREE.Vector3(this.overlayTest.position.x, this.overlayTest.position.y, this.overlayTest.position.z);
        // console.log(mouse3D);
        pos3Dto2D.project(this.camera);
        // console.log(mouse3D)

        this.labelTest.position.set(window.innerWidth * pos3Dto2D.x * 0.5, window.innerHeight * pos3Dto2D.y * 0.5, 5)
        

            // renderer.clear();
            // renderer.render( scene, camera );
            this.renderer.clearDepth();
            this.renderer.render( this.sceneOrtho, this.cameraOrtho );
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


        this.getMaterial(name)

        let mesh = new THREE.Mesh(
            this.planeGeometry,
            this.assets[name].material
        )


        let text = displayName
        while (text.length < 30) text += ' ' // right pad

        let label = makeTextSprite(text)

        // label.position.set(0.5, 0, 0.5)
        // label.position.normalize()
        
        label.visible = showName

        group.add(mesh)
        group.add(label)

        this.scene.add(group)

        group.name = name // required for picking
        
        return group
    }


    makeFloor(name, props = {}) {
        let floor = this.initEntity(name, props)

        floor.rotateX(-Math.PI / 2)
        return floor
    }


}

module.exports = SurvivalGame


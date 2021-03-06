/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// let THREE = require('./../../libs/three/three')

global.THREE = require('./../../libs/three/three')
require('./../../libs/three/loaders/MTLLoader')
require('./../../libs/three/loaders/OBJLoader')

let BaseGame = require('./../../core/base_game')

let DeityCamera = require('./../../core/camera/deity')
let CustomButton = require('./../../components/custom_button')

let { ipcRenderer, remote } = require('electron');

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)
    }

    // Called when start() is called and the renderer has been initialised
    init() {

        this.cameraControl = new DeityCamera(
            this.camera,
            (key) => this.keyDown(key),
            this.mouse,
            15 // camera velocity in units/second
        )

        this.camera.position.y = 2.5
        this.camera.position.z = 5
        // this.cameraControl.update(1)

        this.initLights()            

        this.loadOBJwithMTL('steerSkull', 10,0,-10)

        this.loadOBJwithMTL('cactus', 4,0,-10)


        this.loadOBJwithMTL('coin', 10,0,-16)


        this.loadOBJwithMTL('console', 6,0,-16)
        this.loadOBJwithMTL('deadTree1', 2,0,-20)

        this.loadOBJwithMTL('bullet', -4,0,-16)
        this.loadOBJwithMTL('bulletShell', 0,0,-16)
        this.loadOBJwithMTL('rifleBullet', -8,0,-16)
        this.loadOBJwithMTL('rifleBulletShell', -12,0,-16)
        this.loadOBJwithMTL('boot', -6,0,-10)
        this.loadOBJwithMTL('barrel', -2,0,-8)
        this.loadOBJwithMTL('bank', -8,0,-8)
        this.loadOBJwithMTL('badge', -4,0,-4)
        this.loadOBJwithMTL('axeHead', -8)
        this.loadOBJwithMTL('10GallonHat', -4)
        this.loadOBJwithMTL('beerBottle', 2)
        this.loadOBJwithMTL('toyHorse', 4)
        // this.loadOBJwithMTL('train', 30)
        this.loadOBJwithMTL('trainEngine', 30)
        this.loadOBJwithMTL('trainCarriage', 30)
        this.loadOBJwithMTL('rifle', 6)
        this.loadOBJwithMTL('revolver', 8)


        this.loadOBJwithMTL('gravePile', 12)
        this.loadOBJwithMTL('hat1', 16)
        this.loadOBJwithMTL('hat2', 20)
        this.loadOBJwithMTL('hitchingPost', 16, 0, -40)

        this.loadOBJwithMTL('moneyBag', 12, 0, -4)
        this.loadOBJwithMTL('noose', 16, 0, -4)

        this.loadOBJwithMTL('pickDoubleHead', 16, 0, -16)
        this.loadOBJwithMTL('pickHead', 20, 0, -16)

        this.loadOBJwithMTL('sack', 8, 0, -20)
        this.loadOBJwithMTL('saloon', 8, 0, -24)
        this.loadOBJwithMTL('saloonDoor1', 16, 0, -28)
        this.loadOBJwithMTL('saloonDoor2', 20, 0, -28)



        this.loadOBJwithMTL('saloonSign', -4,0,-20)
        this.loadOBJwithMTL('spaceShip1', -8,0,-20)
        this.loadOBJwithMTL('spaceShip2', -16,0,-20)
        this.loadOBJwithMTL('spanner', -20,0,-20)


        this.loadOBJwithMTL('table', 0,0,-30)
        this.loadOBJwithMTL('tombstone1', -4,0,-30)
        this.loadOBJwithMTL('tombstone2', -8,0,-30)
        this.loadOBJwithMTL('toolHandle', -12,0,-30)
        this.loadOBJwithMTL('torsoMuscle.1', -16,0,-30)
        this.loadOBJwithMTL('trainTrack', -20,0,-30)
        this.loadOBJwithMTL('whiskeyBottle1', -28,0,-30)
    
    
        this.loadOBJwithMTL('wagonWheel', -24,0,-40)
    }

    deInit() {
    }


    update(delta) {
        this.cameraControl.update(delta)
    }

    onWindowResize() {
        let { camera, renderer } = this
    }

    gui(guiHandle) {

        this.reactHandle = guiHandle // Get handle to gui to force redraws elsewhere

        return React.createElement(
            'div',
            {},
            `GUI`

        )
    }



    loadOBJwithMTL(name,x=0,y=0,z=0){
    

        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('./modules/saloon/models/');
        mtlLoader.setPath('./modules/saloon/models/');


        let objLoader = new THREE.OBJLoader();
        
        objLoader.setPath('./modules/saloon/models/');

        mtlLoader.load(name+'.mtl', (materials) => {
         
            objLoader.setMaterials(materials);
            materials.preload();
         
            objLoader.load(name+'.obj', (object) => {
         
                this.scene.add(object);
                // object.position.y -= 60;
                object.position.x = x
                object.position.y = y
                object.position.z = z
                // object.children[0].geometry.name = 'beerBottle'
                // console.log(object)
         
            });
         
        });
    }

    initLights(){

        var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
        keyLight.position.set(-100, 0, 100);
         
        var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
        fillLight.position.set(100, 0, 100);
         
        var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
        backLight.position.set(100, 0, -100).normalize();
         
        this.scene.add(keyLight);
        this.scene.add(fillLight);
        this.scene.add(backLight);
    }


}

module.exports = SurvivalGame


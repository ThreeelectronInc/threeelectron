/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../libs/three/three')

let BaseGame = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let chickenClass = require('./../core/entities/chicken')


let DeityCamera = require('./../core/camera/deity')

let { ipcRenderer, remote } = require('electron');


class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.time_elapsed = 0


    }

    // Called when start() is called and the renderer has been initialised
    init() {


        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(0, 500, 1000)
        this.camera.lookAt(0,500,0)


        let simpleShader = require('./../core/shaders/simple')
        let matShader = simpleShader.make()


        let geomShader = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshShader = new THREE.Mesh(geomShader, matShader);
        this.scene.add(meshShader)



        //// This is where we create our off-screen render target ////


        // Create a different scene to hold our buffer objects
        this.bufferScene = new THREE.Scene()
        let { RenderBuffer } = require('./../core/render_buffer')
        this.renderBuffer = new RenderBuffer(this.renderer, this.bufferScene, 512)
        this.bufferMaterial = new THREE.MeshBasicMaterial({ map: this.renderBuffer.bufferTexture.texture, transparent: true, side: THREE.DoubleSide })

        let mapChicken = new THREE.TextureLoader().load("assets/chicken.png");
        let matChicken = new THREE.SpriteMaterial({ map: mapChicken, color: 0xffffff });
        let geomChicken = new THREE.Sprite(matChicken);
        this.bufferScene.add(geomChicken)

        let perlin2d = require('./../core/shaders/perlin2d')
        this.matShader2 = perlin2d.make()
        this.matShader2.uniforms['toColor'] = { value: 1 }


        this.bufferBackgroundPlane = new THREE.PlaneGeometry(1, 1, 1)
        this.backgroundRRT = new THREE.Mesh(this.bufferBackgroundPlane, this.matShader2);
        this.bufferScene.add(this.backgroundRRT)

        let geomRTT = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshRTT = new THREE.Mesh(geomRTT, this.bufferMaterial);

        meshRTT.position.set(1000, 0, 0)
        this.scene.add(meshRTT)


        this.cameraControl = new DeityCamera(this.camera, (key) => this.keyDown(key), this.mouse)

    }

    deInit() {
    }

    update(delta) {

        this.cameraControl.update(delta)


        if (this.keyPressed('h')) {
            this.devTools = !this.devTools
            ipcRenderer.send('toggle-dev', this.devTools)
            console.log(this.devTools)
        }

        if (this.keyPressed('c')) {
            this.matShader2.uniforms['toColor'].value = (this.matShader2.uniforms['toColor'].value - 1) * -1
            console.log(this.matShader2.uniforms['toColor'].value)
        }

        // # set a uniform to tell the shader the size of a single pixel
        this.matShader2.uniforms['pixel'] = { value: new THREE.Vector2(1.0 / this.renderBuffer.bufferScale, 1.0 / this.renderBuffer.bufferScale) }
        this.matShader2.uniforms['window'] = { value: new THREE.Vector2(this.renderBuffer.bufferScale, this.renderBuffer.bufferScale) }


        this.time_elapsed += delta
        this.matShader2.uniforms['time'] = { value: this.time_elapsed * 0.05 }
        // self.shader.uniformf('positionOffset', 0, 0)
        this.matShader2.uniforms['scale'] = { value: 1.5 }
        
        this.matShader2.uniforms['step'] = { value: 0.1 }

        this.renderBuffer.render()
    }
}

module.exports = SurvivalGame

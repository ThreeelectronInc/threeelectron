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


        this.chickenCount = 0
        this.chickensDone = false
        this.time_elapsed = 0


    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")


        TerrainGenerator.generateTerrain(this.scene)
        console.log('moving on while terrain generates')

        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        // this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        this.camera.position.set(0, 500, 1000)
        this.camera.lookAt(0,500,0)


        this.chickens = []

        this.cameraControl = new DeityCamera(this.camera, 
            (key) => this.keyDown(key), 
            this.mouse)

    }

    deInit() {
        TerrainGenerator.world.clear()
    }

    update(delta) {

        this.cameraControl.update(delta)


        if (this.keyPressed('h')) {
            this.devTools = !this.devTools
            ipcRenderer.send('toggle-dev', this.devTools)
            console.log(this.devTools)
        }


        if (!this.chickensDone) { // TerrainGenerator.world.done && 
            console.log("start generating chickens")

            for (let x = 0; x < TerrainGenerator.world.totalWidth; x++) {

                for (let z = 0; z < TerrainGenerator.world.totalDepth; z++) {

                    let minY = TerrainGenerator.world.waterLevel - 1
                    let maxY = TerrainGenerator.world.waterLevel + 10

                    for (let y = minY; y < maxY; y++)

                        if (TerrainGenerator.getHeight(x, z) === y + 1 && !this.chickensDone) {//&& TerrainGenerator.world.getChunk(x,TerrainGenerator.world.waterLevel,z)) {

                            let chicken = new chickenClass.Chicken(this.scene, x * chunkClass.blockScale, chunkClass.blockScale + (y + 40) * chunkClass.blockScale, z * chunkClass.blockScale)
                            this.chickens.push(chicken)

                            chicken.poop()

                            // console.log('chicken count: ', entityClass.chickenCount)

                        }

                    if (chickenClass.chickenCount > 50) {
                        this.chickensDone = true
                        break;
                    }

                }

                if (this.chickensDone) {
                    break
                }
            }
        }

        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].update(delta)
        }
    }
}

module.exports = SurvivalGame
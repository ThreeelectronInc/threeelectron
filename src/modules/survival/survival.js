/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


let BaseGame = require('./../../core/base_game')
let TerrainGenerator = require('./terrain_generator')

let chunkClass = require('./chunk')
let chickenClass = require('./entities/chicken')


let DeityCamera = require('./../../core/camera/deity')

let { ipcRenderer, remote } = require('electron');


class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)


        this.chickenCount = 0
        this.chickensDone = false
        this.time_elapsed = 0


    }

    makeParticles() {

        let geometry, materials = [], parameters, i, h, color, sprite, size;
        this.particles = []

        geometry = new THREE.Geometry();

        var textureLoader = new THREE.TextureLoader();

        var sprite1 = textureLoader.load("assets/bee.png");
        var sprite2 = textureLoader.load("assets/chicken.png");
        var sprite3 = textureLoader.load("assets/bee.png");
        var sprite4 = textureLoader.load("assets/skull.png");
        var sprite5 = textureLoader.load("assets/skull.png");

        for (i = 0; i < 10000; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push(vertex);

        }

        parameters = [
            [[1.0, 1.0, 1.0], sprite2, 20],
            [[1.0, 1.0, 1.0], sprite3, 15],
            [[1.0, 1.0, 1.0], sprite1, 10],
            [[1.0, 1.0, 1.0], sprite5, 8],
            [[1.0, 1.0, 1.0], sprite4, 5]
        ];

        for (i = 0; i < parameters.length; i++) {

            color = parameters[i][0];
            sprite = parameters[i][1];
            size = parameters[i][2];

            materials[i] = new THREE.PointsMaterial({
                size: size,
                map: sprite,
                blending: THREE.NoBlending,//THREE.AdditiveBlending, 
                depthTest: true,
                transparent: true,
                alphaTest: 0.01// 1.0
            });
            // materials[i].color.setHSL(color[0], color[1], color[2]);
            materials[i].color.setRGB(color[0], color[1], color[2]);


            this.particles[i] = new THREE.Points(geometry, materials[i]);

            this.particles[i].rotation.x = Math.random() * 6;
            this.particles[i].rotation.y = Math.random() * 6;
            this.particles[i].rotation.z = Math.random() * 6;

            this.scene.add(this.particles[i]);

        }
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
        // this.camera.lookAt(0,500,0)


        this.chickens = []

        this.cameraControl = new DeityCamera(this.camera,
            (key) => this.keyDown(key),
            this.mouse)


            this.makeParticles()
            this.particlesDone = true
    }

    onWindowResize() {
        let { camera, renderer } = this

    }

    deInit() {
        TerrainGenerator.world.clear()
    }



    update(delta) {


        // TWEEN.update();

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

        if (TerrainGenerator.world.done && !this.particlesDone) {

            // this.makeParticles()
            // this.particlesDone = true
        }

        if (this.particlesDone) {

            for (i = 0; i < this.particles.length; i++) {
                this.particles[i].rotateY(0.1 * delta) 
            }
        }
    }
}

module.exports = SurvivalGame
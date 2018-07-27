/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


let BaseGame = require('./../../core/base_game')

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
    }



    update(delta) {


        // TWEEN.update();

        this.cameraControl.update(delta)


        if (this.keyPressed('h')) {
            this.devTools = !this.devTools
            ipcRenderer.send('toggle-dev', this.devTools)
            console.log(this.devTools)
        }

        if (this.particlesDone) {

            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].rotateY(0.1 * delta) 
            }
        }
    }
}

module.exports = SurvivalGame
let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let entityClass = require('./../core/entities/entity')
// let {Stats} = require('./../libs/stats.min.js')
class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.rotYOffset = 0
        this.radiusOffset = 1000
        this.heightOffset = 1000

        this.lookPos = new THREE.Vector3()

        this.chickenCount = 0
        this.chickensDone = false


    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")


        this.stats = new Stats();
        this.parentDiv.appendChild(this.stats.dom)

        
        TerrainGenerator.generateTerrain(this.scene)
        console.log('moving on while terrain generates')
        // console.log(chicken.position)

        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(100, 500, 100)
        this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        console.log(this.lookPos)

        this.chickens = []



        let matShader = new THREE.ShaderMaterial({

            uniforms: {

                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }

            },

            vertexShader: `	
            varying vec2 vUv;
            
                        void main()
                        {
                            vUv = uv;
                            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                            gl_Position = projectionMatrix * mvPosition;
                        }
            `,

            fragmentShader: `			
            uniform float time;
            
                        varying vec2 vUv;
            
                        void main( void ) {
            
                            vec2 position = - 1.0 + 2.0 * vUv;
            
                            float red = abs( sin( position.x * position.y + time / 5.0 ) );
                            float green = abs( sin( position.x * position.y + time / 4.0 ) );
                            float blue = abs( sin( position.x * position.y + time / 3.0 ) );
                            gl_FragColor = vec4( red, green, blue, 1.0 );
                        }
            `
        });


        let geomShader = new THREE.PlaneGeometry(1000,1000,1000);
        let meshShader = new THREE.Mesh( geomShader, matShader );
        this.scene.add(meshShader)
        // geomShader.scale.set()
    }

    deInit() {
    }

    update(delta) {


        this.stats.update()
        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        if (keyD("w")) { this.radiusOffset -= camVel }
        if (keyD("s")) { this.radiusOffset += camVel }
        if (keyD("a")) { this.rotYOffset += camVel * 0.005 }
        if (keyD("d")) { this.rotYOffset -= camVel * 0.005 }

        if (keyD("e")) { this.heightOffset += camVel }
        if (keyD("q")) { this.heightOffset -= camVel }


        if (this.isMouseDown[0]) {
            this.rotYOffset -= this.mouse.xVel * 0.01
            this.heightOffset -= this.mouse.yVel * 5
        }
        else { // rotate slowly
            // this.rotYOffset = this.rotYOffset + delta * 0.1
        }


        this.radiusOffset -= 0.25 * this.mouse.wheel

        this.radiusOffset = Math.max(this.radiusOffset, 0.01)

        this.camera.position.set(this.radiusOffset * Math.cos(this.rotYOffset), Math.sin(this.rotYOffset) * 50 + this.heightOffset, this.radiusOffset * Math.sin(this.rotYOffset));
        this.camera.position.add(this.lookPos)
        this.camera.lookAt(this.lookPos);


        if (!this.chickensDone) { // TerrainGenerator.world.done && 
            console.log("start generating chickens")

            for (let x = 0; x < TerrainGenerator.world.totalWidth; x++) {

                for (let z = 0; z < TerrainGenerator.world.totalDepth; z++) {

                    let minY = TerrainGenerator.world.waterLevel - 1
                    let maxY = TerrainGenerator.world.waterLevel + 10

                    for (let y = minY; y < maxY; y++)

                        if (TerrainGenerator.getHeight(x, z) === y + 1 && !this.chickensDone) {//&& TerrainGenerator.world.getChunk(x,TerrainGenerator.world.waterLevel,z)) {
                            let chicken = new entityClass.Entity(this.scene, x * chunkClass.blockScale, chunkClass.blockScale + y * chunkClass.blockScale, z * chunkClass.blockScale)
                            this.chickens.push(chicken)

                            // console.log('chicken count: ', entityClass.chickenCount)

                        }

                    if (entityClass.chickenCount > 2000) {
                        this.chickensDone = true
                        break;
                    }

                }

                if (this.chickensDone) {
                    break
                }
            }
        }

        // for (var i = 0; i < this.chickens.length; i++) {
        //     this.chickens[i].update(delta)
        // }

    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
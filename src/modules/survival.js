let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let entityClass = require('./../core/entities/entity')

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.lookPos = new THREE.Vector3()

        this.chickenCount = 0
        this.chickensDone = false


    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")

        
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


        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        let forwardVec = new THREE.Vector3()
        let mouseVec = new THREE.Vector3()
        let lookVec = new THREE.Vector3()
        let upVec = new THREE.Vector3(0,1,0)
        let leftVec = upVec.clone()

        lookVec.subVectors(this.lookPos, this.camera.position)

        forwardVec = lookVec.clone() 
        forwardVec.y = 0

        
        forwardVec = forwardVec.normalize().multiplyScalar(delta * 500)

        mouseVec = forwardVec.clone()

        leftVec.cross(forwardVec)

        // TODO: Make pan and zoom methods

        if (keyD("w")) { this.camera.position.add(forwardVec); this.lookPos.add(forwardVec)}
        if (keyD("s")) {this.camera.position.sub(forwardVec); this.lookPos.sub(forwardVec)}
        if (keyD("a")) { this.camera.position.add(leftVec);  this.lookPos.add(leftVec)}
        if (keyD("d")) {this.camera.position.sub(leftVec);  this.lookPos.sub(leftVec)}

        if (keyD("e")) { this.camera.position.y += camVel }
        if (keyD("q")) { this.camera.position.y -= camVel }
        

        if (this.isMouseDown[0]) {
            let mousePan = forwardVec.clone().multiplyScalar(this.mouse.yVel)
                .add(leftVec.clone().multiplyScalar(this.mouse.xVel))

            
            this.camera.position.add(mousePan); 
  
            this.lookPos.add(mousePan)
        }
        if  (this.isMouseDown[2]) {
            
            let rotVec = lookVec.clone()
            rotVec.applyAxisAngle(upVec, this.mouse.xVel * 0.01)
            
            this.camera.position.subVectors(this.lookPos, rotVec)


            // this.camera.position.y += this.mouse.yVel * -2

            let testZoomDistanceVec = lookVec.clone()
            testZoomDistanceVec.y = 0 
            console.log(testZoomDistanceVec.length())
            if (testZoomDistanceVec.length() > 50 || this.mouse.yVel < 0 ){

                mouseVec.multiplyScalar(this.mouse.yVel * 1)
            
                this.camera.position.add(mouseVec)
                    

            }
        }

        // mouseVec.multiplyScalar(this.mouse.wheel * 0.05)
        // this.camera.position.add(mouseVec)

        this.camera.position.y += this.mouse.wheel * -0.25
        

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

                    if (entityClass.chickenCount > 500) {
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
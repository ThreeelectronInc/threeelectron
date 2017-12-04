let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let entityClass = require('./../core/entities/entity')



let {ipcRenderer, remote} = require('electron'); 



class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.lookPos = new THREE.Vector3()

        this.chickenCount = 0
        this.chickensDone = false
        this.time_elapsed = 0

    this.r = 2;
    this.theta = Math.PI / 2;
    this.phi = 0;

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


        let simpleShader = require('./../core/shaders/simple')
        let matShader = simpleShader.make()


        let geomShader = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshShader = new THREE.Mesh(geomShader, matShader);
        this.scene.add(meshShader)



        //// This is where we create our off-screen render target ////


        // Create a different scene to hold our buffer objects
        this.bufferScene = new THREE.Scene()
        let {RenderBuffer} = require('./../core/render_buffer')
        this.renderBuffer = new RenderBuffer(this.renderer,this.bufferScene, 512)
        this.bufferMaterial = new THREE.MeshBasicMaterial({ map: this.renderBuffer.bufferTexture.texture, transparent: true, side: THREE.DoubleSide })
        
        let mapChicken = new THREE.TextureLoader().load("assets/chicken.png");
        let matChicken = new THREE.SpriteMaterial({ map: mapChicken, color: 0xffffff });
        let geomChicken = new THREE.Sprite(matChicken);
        this.bufferScene.add(geomChicken)

        let perlin2d = require('./../core/shaders/perlin2d')
        this.matShader2 = perlin2d.make()

        this.bufferBackgroundPlane = new THREE.PlaneGeometry(1, 1, 1)
        this.backgroundRRT = new THREE.Mesh(this.bufferBackgroundPlane, this.matShader2);
        this.bufferScene.add(this.backgroundRRT)

        let geomRTT = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshRTT = new THREE.Mesh(geomRTT, this.bufferMaterial);

        meshRTT.position.set(1000, 1000, 1000)
        this.scene.add(meshRTT)



// Listen for main message
ipcRenderer.on('ping', (event, arg) => {  
    // Print 5
    console.log(arg);
    // Invoke method directly on main process
    // main.pong(6);
});

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
        let upVec = new THREE.Vector3(0, 1, 0)
        let leftVec = upVec.clone()

        lookVec.subVectors(this.lookPos, this.camera.position)

        forwardVec = lookVec.clone()
        forwardVec.y = 0


        forwardVec = forwardVec.normalize().multiplyScalar(delta * 500)

        mouseVec = forwardVec.clone()

        leftVec.cross(forwardVec)

        // TODO: Make pan and zoom methods

        if (keyD("w")) { this.camera.position.add(forwardVec); this.lookPos.add(forwardVec) }
        if (keyD("s")) { this.camera.position.sub(forwardVec); this.lookPos.sub(forwardVec) }
        if (keyD("a")) { this.camera.position.add(leftVec); this.lookPos.add(leftVec) }
        if (keyD("d")) { this.camera.position.sub(leftVec); this.lookPos.sub(leftVec) }

        let rotSpeed = 0.05
        if (keyD("e")) { 
            
            let rotVec = lookVec.clone()
            rotVec.applyAxisAngle(upVec, rotSpeed)

            this.camera.position.subVectors(this.lookPos, rotVec)

        }
        if (keyD("q")) { 
            

            let rotVec = lookVec.clone()
            rotVec.applyAxisAngle(upVec, -rotSpeed)

            this.camera.position.subVectors(this.lookPos, rotVec)

        }

        if (keyD("r")) { this.camera.position.y += camVel; this.lookPos.y += camVel }
        if (keyD("f")) { this.camera.position.y -= camVel; this.lookPos.y -= camVel }

        if (this.keyPressed('h')){
            this.devTools = !this.devTools
            ipcRenderer.send('toggle-dev', this.devTools)
            console.log(this.devTools)
        }

        const mousePadSpeed = 0.25
        if (this.isMouseDown[0]) {
            let mousePan = forwardVec.clone().multiplyScalar(this.mouse.yVel * mousePadSpeed)
                .add(leftVec.clone().multiplyScalar(this.mouse.xVel * mousePadSpeed))


            this.camera.position.add(mousePan);

            this.lookPos.add(mousePan)
        }
        if (this.isMouseDown[2]) {

            let rotVec = lookVec.clone()
            rotVec.applyAxisAngle(upVec, this.mouse.xVel * 0.005)

            this.camera.position.subVectors(this.lookPos, rotVec)


            // this.camera.position.y += this.mouse.yVel * -2

            let testZoomDistanceVec = lookVec.clone()
            testZoomDistanceVec.y = 0
            // console.log(testZoomDistanceVec.length())
            if (testZoomDistanceVec.length() > 50 || this.mouse.yVel < 0) {

                mouseVec.multiplyScalar(this.mouse.yVel * 0.5)

                this.camera.position.add(mouseVec)


            }
        }

        // mouseVec.multiplyScalar(this.mouse.wheel * 0.05)
        // this.camera.position.add(mouseVec)

        this.camera.position.y += this.mouse.wheel * 0.25 
        this.lookPos.y += this.mouse.wheel * 0.25 
        


        this.camera.lookAt(this.lookPos);


        if (!this.chickensDone) { // TerrainGenerator.world.done && 
            console.log("start generating chickens")

            for (let x = 0; x < TerrainGenerator.world.totalWidth; x++) {

                for (let z = 0; z < TerrainGenerator.world.totalDepth; z++) {

                    let minY = TerrainGenerator.world.waterLevel - 1
                    let maxY = TerrainGenerator.world.waterLevel + 10

                    for (let y = minY; y < maxY; y++)

                        if (TerrainGenerator.getHeight(x, z) === y + 1 && !this.chickensDone) {//&& TerrainGenerator.world.getChunk(x,TerrainGenerator.world.waterLevel,z)) {
                            let chicken = new entityClass.Entity(this.scene, x * chunkClass.blockScale, chunkClass.blockScale + (y + 20) * chunkClass.blockScale, z * chunkClass.blockScale)
                            this.chickens.push(chicken)

                            // console.log('chicken count: ', entityClass.chickenCount)

                        }

                    if (entityClass.chickenCount > 50) {
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

        // # set a uniform to tell the shader the size of a single pixel
        this.matShader2.uniforms['pixel'] = {value: new THREE.Vector2( 1.0/this.renderBuffer.bufferScale, 1.0/this.renderBuffer.bufferScale)}
        this.matShader2.uniforms['window'] = {value: new THREE.Vector2( this.renderBuffer.bufferScale, this.renderBuffer.bufferScale)}
        
        
        this.time_elapsed += delta
        this.matShader2.uniforms['time'] = {value: this.time_elapsed * 0.05}
        // self.shader.uniformf('positionOffset', 0, 0)
        this.matShader2.uniforms['scale'] = {value: 1.5}
        this.matShader2.uniforms['toColor'] = {value: 1}
        this.matShader2.uniforms['step'] = {value: 0.1}
        
        this.renderBuffer.render()
    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
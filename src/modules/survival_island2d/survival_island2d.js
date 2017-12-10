// THIS GAME BELONGS TO MIT
let THREE = require('./../../libs/three/three')

let BaseGame = require('./../../core/base_game')

let Camera2D = require('./../../core/camera/2d')

let { ipcRenderer, remote } = require('electron');

let TerrainGenerator = require('./core/terrain_generator')
let SoundManager = require('./core/sound_manager')

let chickenClass = require('./entities/chicken')
let manClass = require('./entities/man')
let bearClass = require('./entities/bear') 

// init the tile materials
require('./core/tile_materials')

class SurvivalIsland2D extends BaseGame {

    constructor(tagName, fps = 60) {

        // Create a basic ortho camera

        let height = 10
        let width = height * window.innerWidth / window.innerHeight

        let camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
        

        super(tagName, fps, "#000000", camera)

        this.camZoom = 5
        this.time_elapsed = 0

        this.WORLD_WIDTH = 200
        this.WORLD_HEIGHT = 200

        this.tiles = []
    }

    setTile(x, y, tileType) {
        x = Math.floor(x) | 0
        y = Math.floor(y) | 0

        this.tiles[y * this.WORLD_WIDTH + x] = tileType
    }

    getTile(x, y) {
        x = Math.floor(x) | 0
        y = Math.floor(y) | 0

        return this.tiles[y * this.WORLD_WIDTH + x]
    }

    init() {
        this.entities = []

        // Camera
        // this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        this.camera.position.set(50, 70, 50)
        this.camera.lookAt(50, 0, 50)

        this.cameraControl = new Camera2D(this.camera, (key) => this.keyDown(key), this.mouse)

         // instantiate a listener
        this.audioListener = new THREE.AudioListener();

        // add the listener to the camera
        this.camera.add(this.audioListener);

        SoundManager.load_audio('modules/survival_island2d/RightOfPassage.mp3', 0.5, this.audioListener, (audio) => { this.soundTrack = audio; audio.play(); })

        let MaterialManager = require('./core/material_manager_new')
        let { TileType } = require('./core/tile')


        let planeGeom = new THREE.PlaneBufferGeometry(1, 1);
        planeGeom.rotateX(-Math.PI / 2);
        planeGeom.translate(0, 0, 0);

        // Use to merge faces
        let planeTmpGeometry = new THREE.Geometry().fromBufferGeometry(planeGeom);
        this.materials = {}
        this.materialBrightness = {}

        let geometriesTmp = {}

        TerrainGenerator.generateTileMap(this)

        let uniqueMaterials = 0
        let resolution = 100
        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let matrix = new THREE.Matrix4();
                matrix.makeTranslation(x, 0, y);

                let tile = this.getTile(x, y)

                let h = TerrainGenerator.getHeight(x, y) - TerrainGenerator.getBaseHeight(x, y)

                let v = Math.floor(h * resolution) | 0

                let key = tile + "_" + v

                if (!(key in geometriesTmp)) {
                    geometriesTmp[key] = new THREE.Geometry();
                }

                if (!(key in this.materials)) {
                    v = v > resolution ? resolution : v
                    let bright = 0.4 * v / resolution + 0.8

                    bright = bright > 1 ? 1 : bright
                    this.materialBrightness[key] = bright
                    this.materials[key] = MaterialManager.get_colored_material(tile, new THREE.Color(bright, bright, bright))
                    uniqueMaterials++
                }

                geometriesTmp[key].merge(planeTmpGeometry, matrix)
            }
        }

        console.log("Unique Materials: ", uniqueMaterials)

        let geometries = {}

        for (let key in geometriesTmp) {
            geometriesTmp[key].mergeVertices() // Not sure if this actually helps much or at all
            geometries[key] = new THREE.BufferGeometry().fromGeometry(geometriesTmp[key]);

            let mesh = new THREE.Mesh(geometries[key], this.materials[key]);
            this.scene.add(mesh);
        }

       // this.chicken = new chickenClass.Chicken(this, 50, 1, 50)
        this.man = new manClass.Man(this, 50, 1, 50,
            (key) => this.keyDown(key))

        new bearClass.Bear(this, 52, 1, 52)
        new bearClass.BlackBear(this, 48, 1, 48)  
        new bearClass.GoldenBear(this, 52, 1, 48)
        new bearClass.GreyBear(this, 48, 1, 52)
        new bearClass.HazelBear(this, 50, 1, 48)
        new bearClass.RedBear(this, 52, 1, 50)
        new bearClass.LightBrownBear(this, 52, 1, 50)
        new bearClass.WhiteBear(this, 50, 1,52)


        this.cameraControl.focus(this.man)

    }

    onWindowResize() {
        let { camera, renderer } = this
        let aspect = window.innerWidth / window.innerHeight;
        let size = 8
        camera.aspect = aspect *  window.innerWidth;

        camera.left = - size * aspect / 2
        camera.right = size * aspect / 2
        camera.top = size / 2
        camera.bottom = - size / 2
    }

    deInit() {
        this.soundTrack.stop()
    }

    registerEntity(entity) {
        this.entities.push(entity)
    }

    update(delta) {
        this.time_elapsed += delta
        let bright = 0.6 + Math.sin(this.time_elapsed * 0.1) * 0.4

        for (var i = 0; i <  this.entities.length; i++) {
            this.entities[i].update(delta, bright)
        }
        this.cameraControl.update(delta)

        for (let key in this.materials) {
            let baseBright = this.materialBrightness[key]
            let material = this.materials[key]
            let b = baseBright * bright
            material.color = new THREE.Color(b, b, b)
        }

        if (this.keyPressed('p')){
            this.pauseToggle()
            // console.log('here')
        }


        if (!this.paused){
            this.cameraControl.focus(this.man)
        }


    }


}

module.exports = SurvivalIsland2D

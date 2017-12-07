// THIS GAME BELONGS TO MIT
let THREE = require('./../../libs/three/three')

let BaseGame = require('./../../core/base_game')

let Camera2D = require('./../../core/camera/2d')

let { ipcRenderer, remote } = require('electron');

let TerrainGenerator = require('./../../survival2d/terrain_generator')

let chickenClass = require('./core/chicken')
let manClass = require('./core/man')

// init the tile materials
require('./../../survival2d/tile_materials')

class SurvivalIsland2D extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps, "#000000")

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


        // Camera
        // this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        this.camera.position.set(50, 70, 50)
        this.camera.lookAt(50,0,50)

        this.cameraControl = new Camera2D(this.camera, (key) => this.keyDown(key), this.mouse)

        let MaterialManager = require('./../../core/material_manager_new')
        let { TileType } = require('./../../survival2d/tile')


        let planeGeom = new THREE.PlaneBufferGeometry(1, 1);
        planeGeom.attributes.uv.array[5] = 0.5;
        planeGeom.attributes.uv.array[7] = 0.5;
        planeGeom.rotateX(-Math.PI / 2);
        planeGeom.translate(0, 0.5, 0);

        // Use to merge faces
        let planeTmpGeometry = new THREE.Geometry().fromBufferGeometry(planeGeom);
        let materials = {}

        let geometriesTmp = {}

        TerrainGenerator.generateTileMap(this)

        let uniqueMaterials = 0
        let resolution = 256
        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let matrix = new THREE.Matrix4();
                matrix.makeTranslation(x,0,y);

                let tile = this.getTile(x,y)

                let h = TerrainGenerator.getHeight(x,y) - TerrainGenerator.getBaseHeight(x, y)

                let v = Math.floor(h * resolution) | 0

                let key = tile + "_" + v

                if (!(key in geometriesTmp)) {
                    geometriesTmp[key] = new THREE.Geometry();
                }

                if (!(key in materials)) {
                    v = v > resolution ? resolution : v
                    let heightVal = 0.4 * v / resolution + 0.8

                    heightVal = heightVal > 1 ? 1 : heightVal

                    materials[key] = MaterialManager.get_colored_material(tile, new THREE.Color(heightVal, heightVal, heightVal))
                    uniqueMaterials++
                }

                geometriesTmp[key].merge(planeTmpGeometry, matrix)
            }
        }

        console.log("Unique Materials: ", uniqueMaterials)

        let geometries = {}

        for (let key in geometriesTmp){
            geometriesTmp[key].mergeVertices() // Not sure if this actually helps much or at all
            geometries[key] = new THREE.BufferGeometry().fromGeometry(geometriesTmp[key]);

            let mesh = new THREE.Mesh(geometries[key],materials[key]);
            this.scene.add(mesh);
        }

        this.chicken = new chickenClass.Chicken(this, 50, 1, 50)
        this.man = new manClass.Man(this, 50, 1, 50,
          (key) => this.keyDown(key))


        this.cameraControl.focus(this.man)
    }

    deInit() {

    }

    update(delta) {
        this.chicken.update(delta)
        this.man.update(delta)
        this.cameraControl.update(delta)
    }

}

module.exports = SurvivalIsland2D

// THIS GAME BELONGS TO MIT
let THREE = require('./../libs/three/three')

let BaseGame = require('./../core/base_game')

let Camera2D = require('./../core/camera/2d')

let { ipcRenderer, remote } = require('electron');

let TerrainGenerator = require('./../survival2d/terrain_generator')


require('./../survival2d/tile_sprites')

class SurvivalIsland2D extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps, "#000000")

        this.time_elapsed = 0

        this.WORLD_WIDTH = 100
        this.WORLD_HEIGHT = 100
    }

    init() {


        // Camera
        // this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        this.camera.position.set(50, 70, 50)
        this.camera.lookAt(50,0,50)

        this.cameraControl = new Camera2D(this.camera, (key) => this.keyDown(key), this.mouse)

        // let SpriteManager = require('./../core/sprite_manager')
        let { TileType } = require('./../survival2d/tile')


        let planeGeom = new THREE.PlaneBufferGeometry(1, 1);
        planeGeom.attributes.uv.array[5] = 0.5;
        planeGeom.attributes.uv.array[7] = 0.5;
        planeGeom.rotateX(-Math.PI / 2);
        planeGeom.translate(0, 0.5, 0);
        
        // Use to merge faces
        let planeTmpGeometry = new THREE.Geometry().fromBufferGeometry(planeGeom);

        let geometriesTmp = {}
        let materials = {}

        let texPaths = {}
        texPaths[TileType.WATER] = "assets/images/Water.png"
        texPaths[TileType.SAND] = "assets/images/Sand.png"
        texPaths[TileType.DIRT] = "assets/images/Dirt.png"
        texPaths[TileType.GRASS] = "assets/images/Grass.png"
        texPaths[TileType.ROCK] = "assets/images/Rock.png"
        texPaths[TileType.TREE] = "assets/images/Tree.png"
        

        for (let enumString in TileType){
            geometriesTmp[TileType[enumString]] = new THREE.Geometry(); 

            let texture = new THREE.TextureLoader().load(texPaths[TileType[enumString]])
            texture.magFilter = THREE.NearestFilter
            texture.minFilter = THREE.LinearMipMapLinearFilter
            texture.encoding = THREE.LinearEncoding

            materials[TileType[enumString]] = new THREE.MeshBasicMaterial( { map: texture } )

        }


        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let h = TerrainGenerator.getHeight(x, y, 0.1)

                let matrix = new THREE.Matrix4();
                matrix.makeTranslation(x,0,y);

                let tile = 0
                if (h < 0.3) {
                    geometriesTmp[TileType.WATER].merge(planeTmpGeometry, matrix)
                }
                else if (h < 0.5) {
                    geometriesTmp[TileType.SAND].merge(planeTmpGeometry, matrix)
                }
                else if (h < 0.8) {
                    geometriesTmp[TileType.GRASS].merge(planeTmpGeometry, matrix)
                }
                else {
                    geometriesTmp[TileType.ROCK].merge(planeTmpGeometry, matrix)
                }

            }    
        }

        let geometries = {}
        // let meshes = []

        for (let enumString in TileType){
            geometriesTmp[TileType[enumString]].mergeVertices() // Not sure if this actually helps much or at all
            console.log(geometriesTmp[TileType[enumString]])
            geometries[TileType[enumString]] = new THREE.BufferGeometry().fromGeometry(geometriesTmp[TileType[enumString]]);
            // geometries[enumString].computeBoundingSphere();
    
            let mesh = new THREE.Mesh(geometries[TileType[enumString]], materials[TileType[enumString]]);
            this.scene.add(mesh);
    
        }


        console.log("done")

    }

    deInit() {
    }

    update(delta) {

        this.cameraControl.update(delta)
    }

}

module.exports = SurvivalIsland2D
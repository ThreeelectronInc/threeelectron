// THIS GAME BELONGS TO MIT
let THREE = require('./../libs/three/three')

let BaseGame = require('./../core/base_game')

let DeityCamera = require('./../core/camera/deity')

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

        this.cameraControl = new DeityCamera(this.camera, (key) => this.keyDown(key), this.mouse)

        let SpriteManager = require('./../core/sprite_manager')
        let { TileType } = require('./../survival2d/tile')


        for (var x = 0; x < this.WORLD_WIDTH; x++) {
            for (var y = 0; y < this.WORLD_HEIGHT; y++) {
                let h = TerrainGenerator.getHeight(x, y, 0.1)

                // console.log(h)

                let tile = 0
                if (h < 0.3) {
                    tile = SpriteManager.get_sprite(TileType.WATER)
                }
                else if (h < 0.5) {
                    tile = SpriteManager.get_sprite(TileType.SAND)
                }
                else if (h < 0.8) {
                    tile = SpriteManager.get_sprite(TileType.GRASS)
                }
                else {
                    tile = SpriteManager.get_sprite(TileType.ROCK)
                }
    
                tile.position.set(x, 0, y)
                this.scene.add(tile)
            }    
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
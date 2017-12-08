let noise = require('./../../../libs/improved_noise')
let perlin = new noise.ImprovedNoise()

let randSeed = Math.random(), randX = Math.random(), randZ = Math.random()
let { TileType } = require('./tile')
let Mathf = require('./../../../core/utils/math')
let OCEAN_DEPTH = 30
let WORLD_WIDTH = 200
let WORLD_HEIGHT = 200
let SEA_LEVEL_OFFSET = 0.16
let BASE_FREQUENCY = 0.06


let OCEAN_LEVEL = 0.2
let SAND_LEVEL = 0.45
let MAIN_LAND_LEVEL = 0.85

function lerp (a,  b,  c) {
    c = c < 0 ? 0 : c
    c = c > 1 ? 1 : c
    return a + c * (b - a);
}

function getPerlinRandom(x, y, f) {
    return perlin.noise(randX + f * x, randZ + f * y, randSeed) + 0.4
}

function getHeight(x, y) {

    let h = 0
    let q = 1

    for (var j = 0; j < 1; j++) {

        h += getPerlinRandom(x, y, BASE_FREQUENCY);
        q *= 4;
    }

    h += SEA_LEVEL_OFFSET

    h *= Mathf.lerp (0, 1, x / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, y / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, (WORLD_WIDTH - x) / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, (WORLD_HEIGHT - y) / OCEAN_DEPTH);

    return h;
}

function getBaseHeight(x, y) {
    let h = getHeight(x, y)

    if (h < OCEAN_LEVEL) {
        return 0
    }
    else if (h < SAND_LEVEL) {
        return OCEAN_LEVEL
    }
    else if (h < MAIN_LAND_LEVEL) {
        return SAND_LEVEL
    }
    else {
        return MAIN_LAND_LEVEL
    }

    return 1
}

function generateTileMap(world) {
    for (var x = 0; x < world.WORLD_WIDTH; x++) {
        for (var y = 0; y < world.WORLD_HEIGHT; y++) {
            let h = getHeight(x, y)

            let tile = 0
            if (h < OCEAN_LEVEL) {
                tile = TileType.WATER 
            }
            else if (h < SAND_LEVEL) {
                tile = TileType.SAND
            }
            else if (h < MAIN_LAND_LEVEL) {
                let r1 = getPerlinRandom(x, y, 0.15)
                let r2 = getPerlinRandom(x, y, 0.4)

                if (r2 > 0.8) {
                    tile = TileType.TREE
                }
                else {
                    if (r1 > 0.8) {
                        tile = TileType.DIRT
                    }
                    else {
                        tile = TileType.GRASS
                    } 
                }
 
            }
            else {
                tile = TileType.ROCK
            }
            world.setTile(x,y,tile)
        }    
    }
}

module.exports = {
    getHeight,
    generateTileMap,
    getBaseHeight
}
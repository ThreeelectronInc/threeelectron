let noise = require('./../libs/improved_noise')
let perlin = new noise.ImprovedNoise()

let randSeed = Math.random(), randX = Math.random(), randZ = Math.random()
let { TileType } = require('./../survival2d/tile')
let Mathf = require('./../core/utils/math')
let OCEAN_DEPTH = 10
let WORLD_WIDTH = 100
let WORLD_HEIGHT = 100
let SEA_LEVEL_OFFSET = 0.14

function lerp (a,  b,  c) {
    c = c < 0 ? 0 : c
    c = c > 1 ? 1 : c
    return a + c * (b - a);
}

function getPerlinRandom(x, y, f) {
    return perlin.noise(randX + f * x, randZ + f * y, randSeed) + 0.4
}

function getHeight(x, y, f) {

    let h = 0
    let q = 1

    for (var j = 0; j < 1; j++) {

        h += getPerlinRandom(x, y, f);
        q *= 4;
    }

    h += SEA_LEVEL_OFFSET

    h *= Mathf.lerp (0, 1, x / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, y / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, (WORLD_WIDTH - x) / OCEAN_DEPTH);
    h *= Mathf.lerp (0, 1, (WORLD_HEIGHT - y) / OCEAN_DEPTH);

    return h;
}

function generateTileMap(world) {
    for (var x = 0; x < world.WORLD_WIDTH; x++) {
        for (var y = 0; y < world.WORLD_HEIGHT; y++) {
            let h = getHeight(x, y, 0.1)

            let tile = 0
            if (h < 0.3) {
                tile = TileType.WATER 
            }
            else if (h < 0.5) {
                tile = TileType.SAND
            }
            else if (h < 0.86) {
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
    generateTileMap
}
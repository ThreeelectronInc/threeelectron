let THREE = require('./../libs/three/three')

let noise = require('./../libs/improved_noise')
let WORLD = require('./world').Instance

let perlin = new noise.ImprovedNoise()

let randSeed = Math.random(), randX = Math.random(), randZ = Math.random()


function lerp (a,  b,  c) {
    c = c < 0 ? 0 : c
    c = c > 1 ? 1 : c
    return a + c * (b - a);
}

function getHeight(x, z) {

    let h = 0
    let q = 2

    for (var j = 0; j < 4; j++) {

        h += (perlin.noise(randX + x / q, randZ + z / q, randSeed) + 0.4) * 0.5 * q;
        q *= 4;
    }

    h = lerp(-1, h, x / 100)
    h = lerp(-1, h, z / 100)
    h = lerp(-1, h, (WORLD.totalWidth - x) / 100)
    h = lerp(-1, h, (WORLD.totalDepth - z) / 100)

    return h | 0;
}

function generateTerrain(scene) {
    console.log("GENERATE TERRAIN")

    WORLD.generate(getHeight, scene)
}

module.exports = {
    generateTerrain: generateTerrain,
    world: WORLD,
    getHeight,
}
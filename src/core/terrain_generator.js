let THREE = require('./../libs/three/three')

let noise = require('./../libs/improved_noise')
let WORLD = require('./world').Instance

let perlin = new noise.ImprovedNoise(),
    randSeed = 1.53//Math.random();



function getHeight(x, z) {

    let h = 0
    let q = 2

    for (var j = 0; j < 4; j++) {

        h += (perlin.noise(x / q, z / q, randSeed) + 0.4) * 1.8 * q;
        q *= 4;
    }

    return h * 0.2 | 0;
}

function generateTerrain(scene) {
    console.log("GENERATE TERRAIN")
    WORLD.generateWorld(getHeight)
    WORLD.generateMeshes(scene)

}

module.exports = {
    generateTerrain: generateTerrain,
    world: WORLD,
}
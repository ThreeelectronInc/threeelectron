let THREE = require('./../libs/three/three')

let noise = require('./../improved_noise')
let WORLD = require('./world').Instance

let perlin = new noise.ImprovedNoise(),
    randSeed = Math.random();



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
    

    // Lights

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    scene.add(directionalLight);

}

module.exports = {
    generateTerrain: generateTerrain,
}
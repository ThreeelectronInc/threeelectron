let THREE = require('./../libs/three/three')

let noise = require('./../improved_noise')
let chunkClass = require('./chunk')

let blockScale = 7.5

var mesh;

let chunkWidth = 256, chunkDepth = 256, chunkHeight = 128
let chunkHalfWidth = chunkWidth / 2, chunkHalfDepth = chunkDepth / 2, chunkHalfHeight = chunkHeight / 2

let quality = 2

let perlin = new noise.ImprovedNoise(),
    randSeed = Math.random() * blockScale;

let waterLevel = 10

let chunks = []

BlockType = {
    EMPTY : 0,
    WATER : 1,
    SAND : 2,
    DIRT : 3,
    GRASS : 4
}

function getChunk(x, y, z) {
    let localX = x % chunkWidth;
    let localZ = z % chunkDepth;
    let localY = y % chunkHeight;

    return (chunks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
}

function getBlock(x, y, z) {
    let localX = x % this.chunkWidth;
    let localZ = z % this.chunkDepth;
    let localY = y % this.chunkHeight;

    return (this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
}

function getHeight(x, z) {

    let h = 0
    let q = 2

    for (var j = 0; j < 4; j++) {

        h += (perlin.noise(x / q, z / q, randSeed) + 0.4) * 1.8 * q;
        q *= 4;
    }

    return h * 0.2 | 0;
}


function isTransparent(blockID) {
    return blockID == BlockType.WATER
}



function generateTerrain(scene) {
    var chunk = new chunkClass.Chunk(0, 0, 0);
    chunk.generateChunk(getHeight, waterLevel)
    chunk.generateChunkMeshes(scene)
    

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
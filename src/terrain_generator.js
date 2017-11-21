let THREE = require('./libs/three/three')

let noise = require('./improved_noise')

let blockScale = 7.5

var mesh;

let chunkWidth = 256, chunkDepth = 256, chunkHeight = 128
let chunkHalfWidth = chunkWidth / 2, chunkHalfDepth = chunkDepth / 2, chunkHalfHeight = chunkHeight / 2

let quality = 2

let chunkMultiplier = 1;

let perlin = new noise.ImprovedNoise(),
    randSeed = Math.random() * blockScale;

let blocks = []

let waterLevel = 10

BlockType = {
    EMPTY : 0,
    WATER : 1,
    SAND : 2,
    DIRT : 3,
    GRASS : 4
}

for (var z = 0; z < chunkDepth; z++) {
    for (var x = 0; x < chunkWidth; x++) {
        let h = getHeight(x, z)

        let y = 0

        for (y = 0; y < h -1; y++) {
            blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.DIRT
        }

        if (h < waterLevel) {
            blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.SAND
            for (y = h; y < waterLevel; y++) {
                blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.WATER
            }
            h = waterLevel
        }
        else {
            blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.GRASS
        }

        for (y = h; y < chunkHeight; y++) {
            blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.EMPTY
        }
    }
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

function getBlock(x, y, z) {
    let localX = x % chunkWidth;
    let localZ = z % chunkDepth;
    let localY = y % chunkHeight;
    // console.log(2 - x % chunkWidth + 2 - z % chunkDepth)
    // console.log(terrain)
    // return (terrain[(2 - x % chunkWidth + 2 - z % chunkDepth) - 4 ][localX + localZ * chunkWidth] * 0.2) | 0;
    return (blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
}

function isTransparent(blockID) {
    return blockID == BlockType.WATER
}

function generateTerrain(scene) {

    var matrix = new THREE.Matrix4();
    var matrixWater = new THREE.Matrix4();

    var pxGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pxGeometry.attributes.uv.array[1] = 0.5;
    pxGeometry.attributes.uv.array[3] = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(blockScale / 2, 0, 0);

    var nxGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    nxGeometry.attributes.uv.array[1] = 0.5;
    nxGeometry.attributes.uv.array[3] = 0.5;
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- blockScale / 2, 0, 0);

    var pyGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pyGeometry.attributes.uv.array[5] = 0.5;
    pyGeometry.attributes.uv.array[7] = 0.5;
    pyGeometry.rotateX(-Math.PI / 2);
    pyGeometry.translate(0, blockScale / 2, 0);

    var nyGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    nyGeometry.attributes.uv.array[5] = 0.5;
    nyGeometry.attributes.uv.array[7] = 0.5;
    nyGeometry.rotateX(Math.PI / 2);
    nyGeometry.translate(0, -blockScale / 2, 0);

    var pzGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    pzGeometry.attributes.uv.array[1] = 0.5;
    pzGeometry.attributes.uv.array[3] = 0.5;
    pzGeometry.translate(0, 0, blockScale / 2);

    var nzGeometry = new THREE.PlaneBufferGeometry(blockScale, blockScale);
    nzGeometry.attributes.uv.array[1] = 0.5;
    nzGeometry.attributes.uv.array[3] = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -blockScale / 2);

    //

    // BufferGeometry cannot be merged yet.
    var tmpLandGeometry = new THREE.Geometry();
    var tmpUnderwaterGeometry = new THREE.Geometry();
    var tmpWaterGeometry = new THREE.Geometry();

    var pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(pxGeometry);
    var nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(nxGeometry);
    var pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(pyGeometry);
    var nyTmpGeometry = new THREE.Geometry().fromBufferGeometry(nyGeometry);
    var pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(pzGeometry);
    var nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(nzGeometry);


    for (var z = 0; z < chunkDepth * chunkMultiplier; z++) {

        for (var x = 0; x < chunkWidth * chunkMultiplier; x++) {

            for (var y = 0; y < chunkHeight; y++) {
                let block = getBlock(x, y, z)

                if (block == 0) {
                    continue;
                }
                let matrix = new THREE.Matrix4();

                matrix.makeTranslation(
                    x * blockScale - chunkHalfWidth * blockScale,
                    y * blockScale,
                    z * blockScale - chunkHalfDepth * blockScale
                );

                var px = getBlock(x + 1, y, z) | 0;
                var nx = getBlock(x - 1, y, z) | 0;
                var pz = getBlock(x, y, z + 1) | 0;
                var nz = getBlock(x, y, z - 1) | 0;
                var py = getBlock(x, y + 1, z) | 0;
                var ny = getBlock(x, y - 1, z) | 0;

                let tmpGeometry = 0

                switch (block) {
                    case BlockType.WATER: tmpGeometry = tmpWaterGeometry; break;
                    case BlockType.SAND: tmpGeometry = tmpUnderwaterGeometry; break;
                    case BlockType.DIRT: tmpGeometry = tmpLandGeometry; break;
                    case BlockType.GRASS: tmpGeometry = tmpLandGeometry; break;
                }

                if ((!py || isTransparent(py)) && py != block) {
                    tmpGeometry.merge(pyTmpGeometry, matrix);
                }

                if ((!ny || isTransparent(ny)) && ny != block) {
                    tmpGeometry.merge(nyTmpGeometry, matrix);
                }

                if ((!px || isTransparent(px)) && px != block) {
                    tmpGeometry.merge(pxTmpGeometry, matrix);
                }

                if ((!nx || isTransparent(nx)) && nx != block) {
                    tmpGeometry.merge(nxTmpGeometry, matrix);
                }

                if ((!pz || isTransparent(pz)) && pz != block) {
                    tmpGeometry.merge(pzTmpGeometry, matrix);
                }

                if ((!nz || isTransparent(nz)) && nz != block) {
                    tmpGeometry.merge(nzTmpGeometry, matrix);
                }
            }

        }

    }

    var geometryLand = new THREE.BufferGeometry().fromGeometry(tmpLandGeometry);
    geometryLand.computeBoundingSphere();

    var textureLand = new THREE.TextureLoader().load('assets/atlas.png');
    textureLand.magFilter = THREE.NearestFilter;
    textureLand.minFilter = THREE.LinearMipMapLinearFilter;

    var meshLand = new THREE.Mesh(geometryLand, new THREE.MeshLambertMaterial({ map: textureLand }));
    scene.add(meshLand);



    var geometryDirt = new THREE.BufferGeometry().fromGeometry(tmpUnderwaterGeometry);
    geometryDirt.computeBoundingSphere();

    var textureDirt = new THREE.TextureLoader().load('assets/images/Dirt.png');
    textureDirt.magFilter = THREE.NearestFilter;
    textureDirt.minFilter = THREE.LinearMipMapLinearFilter;

    var meshDirt = new THREE.Mesh(geometryDirt, new THREE.MeshLambertMaterial({ map: textureDirt }));
    scene.add(meshDirt);



    var geometryWater = new THREE.BufferGeometry().fromGeometry(tmpWaterGeometry);
    geometryWater.computeBoundingSphere();

    var textureWater = new THREE.TextureLoader().load('assets/images/Water.png');
    textureWater.magFilter = THREE.NearestFilter;
    textureWater.minFilter = THREE.LinearMipMapLinearFilter;

    var meshWater = new THREE.Mesh(geometryWater, new THREE.MeshLambertMaterial({ map: textureWater, transparent: true, side: THREE.DoubleSide }));
    scene.add(meshWater);

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
  
let chunkBlockWidth = 256, chunkBlockDepth = 256, chunkBlockHeight = 128
let octaves = 4
let blockScale = 7.5

let THREE = require('./../libs/three/three')
let WORLD = require('./world').Instance
let BLOCK = require('./block')


class Chunk {
    constructor(x, y, z) {
       this.blocks = []
       this.x = x
       this.y = y
       this.z = z
    }
    
    x() {
        return x * chunkBlockWidth;
    }

    y() {
        return y * chunkBlockHeight;
    }

    z() {
        return z * chunkBlockDepth;
    }


    generateChunk(heightFunc, waterLevel) {
        for (var z = 0; z < chunkBlockDepth; z++) {
            for (var x = 0; x < chunkBlockWidth; x++) {
                let h = heightFunc(x, z)

                let y = 0

                for (y = 0; y < h -1; y++) {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.DIRT
                }

                if (h < waterLevel) {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.SAND
                    for (y = h; y < waterLevel; y++) {
                        this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.WATER
                    }
                    h = waterLevel
                }
                else {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.GRASS
                }

                for (y = h; y < chunkBlockHeight; y++) {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.EMPTY
                }
            }
        }
    }

    getBlock(x, y, z) {
        let localX = x % this.chunkBlockWidth;
        let localZ = z % this.chunkBlockDepth;
        let localY = y % this.chunkBlockHeight;

        return (this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth]) | 0;  
    }

    generateChunkMeshes(scene) {
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


        for (var z = 0; z < chunkBlockDepth; z++) {

            for (var x = 0; x < chunkBlockWidth; x++) {

                for (var y = 0; y < chunkBlockHeight; y++) {
                    let block = this.getBlock(x, y, z)

                    if (block == 0) {
                        continue;
                    }
                    let matrix = new THREE.Matrix4();

                    matrix.makeTranslation(
                        x * blockScale,
                        y * blockScale,
                        z * blockScale
                    );

                    var px = this.getBlock(x + 1, y, z) | 0;
                    var nx = this.getBlock(x - 1, y, z) | 0;
                    var pz = this.getBlock(x, y, z + 1) | 0;
                    var nz = this.getBlock(x, y, z - 1) | 0;
                    var py = this.getBlock(x, y + 1, z) | 0;
                    var ny = this.getBlock(x, y - 1, z) | 0;

                    let tmpGeometry = 0

                    switch (block) {
                        case BLOCK.BlockType.WATER: tmpGeometry = tmpWaterGeometry; break;
                        case BLOCK.BlockType.SAND: tmpGeometry = tmpUnderwaterGeometry; break;
                        case BLOCK.BlockType.DIRT: tmpGeometry = tmpLandGeometry; break;
                        case BLOCK.BlockType.GRASS: tmpGeometry = tmpLandGeometry; break;
                    }

                    if ((!py || WORLD.isTransparent(py)) && py != block) {
                        tmpGeometry.merge(pyTmpGeometry, matrix);
                    }

                    if ((!ny || WORLD.isTransparent(ny)) && ny != block) {
                        tmpGeometry.merge(nyTmpGeometry, matrix);
                    }

                    if ((!px || WORLD.isTransparent(px)) && px != block) {
                        tmpGeometry.merge(pxTmpGeometry, matrix);
                    }

                    if ((!nx || WORLD.isTransparent(nx)) && nx != block) {
                        tmpGeometry.merge(nxTmpGeometry, matrix);
                    }

                    if ((!pz || WORLD.isTransparent(pz)) && pz != block) {
                        tmpGeometry.merge(pzTmpGeometry, matrix);
                    }

                    if ((!nz || WORLD.isTransparent(nz)) && nz != block) {
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
    }
}

module.exports = {
    Chunk: Chunk,
    ChunkBlockWidth: chunkBlockWidth,
    ChunkBlockDepth: chunkBlockDepth,
    ChunkBlockHeight: chunkBlockHeight
}

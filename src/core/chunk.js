  
let chunkBlockWidth = 16, chunkBlockDepth = 16, chunkBlockHeight = 128
let octaves = 4
let blockScale = 7.5

let THREE = require('./../libs/three/three')
let BLOCK = require('./block')


class Chunk {
    constructor(x, y, z) {
       this.blocks = [chunkBlockWidth * chunkBlockDepth * chunkBlockHeight]
       this.x = x
       this.y = y
       this.z = z
       this.generated = false
    }
    
    xWS() { //world space
        return this.x * chunkBlockWidth;
    }

    yWS() {
        return this.y * chunkBlockHeight;
    }

    zWS() {
        return this.z * chunkBlockDepth;
    }


    generateChunk(heightFunc, waterLevel) {
        if (this.generated) {
            return
        }

        this.generated = true

        for (var z = 0; z < chunkBlockDepth; z++) {
            for (var x = 0; x < chunkBlockWidth; x++) {
                let h = heightFunc(x + this.xWS(), z + this.zWS()) - this.yWS()

                let y = 0

                for (y = 0; y < h -1; y++) {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.DIRT
                }

                if (h < waterLevel - this.yWS()) {
                    this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.SAND
                    for (y = h; y < waterLevel - this.yWS(); y++) {
                        this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth] = BLOCK.BlockType.WATER
                    }
                    h = waterLevel - this.yWS()
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
     //   let localX = x % this.chunkBlockWidth;
      //  let localZ = z % this.chunkBlockDepth;
     //   let localY = y % this.chunkBlockHeight;

        return (this.blocks[x + z * chunkBlockWidth + y * chunkBlockWidth * chunkBlockDepth]) | 0;  
    }

    generateMesh(scene, world, heightFunc, waterLevel) {
        this.generateChunk(heightFunc, waterLevel)

        let chunk = world.getChunkIndex(this.x+1, this.y, this.z)
        if (chunk) {
           chunk.generateChunk(heightFunc, waterLevel) 
        }

        chunk = world.getChunkIndex(this.x-1, this.y, this.z)
        if (chunk) {
           chunk.generateChunk(heightFunc, waterLevel) 
        }

        chunk = world.getChunkIndex(this.x, this.y, this.z+1)
        if (chunk) {
           chunk.generateChunk(heightFunc, waterLevel) 
        }

        chunk = world.getChunkIndex(this.x, this.y, this.z-1)
        if (chunk) {
           chunk.generateChunk(heightFunc, waterLevel) 
        }

        var textureLand = new THREE.TextureLoader().load('assets/atlas.png');
        textureLand.magFilter = THREE.NearestFilter;
        textureLand.minFilter = THREE.LinearMipMapLinearFilter;

        var textureDirt = new THREE.TextureLoader().load('assets/images/Dirt.png');
        textureDirt.magFilter = THREE.NearestFilter;
        textureDirt.minFilter = THREE.LinearMipMapLinearFilter;

        var textureWater = new THREE.TextureLoader().load('assets/images/Water.png');
        textureWater.magFilter = THREE.NearestFilter;
        textureWater.minFilter = THREE.LinearMipMapLinearFilter;

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

        let matLand = new THREE.MeshLambertMaterial({ map: textureLand })
        let matDirt = new THREE.MeshLambertMaterial({ map: textureDirt })
        let matWater = new THREE.MeshLambertMaterial({ map: textureWater, transparent: true, side: THREE.DoubleSide })


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

                    let worldX = this.xWS() + x
                    let worldY = this.yWS() + y
                    let worldZ = this.zWS() + z

                    let matrix = new THREE.Matrix4();

                    matrix.makeTranslation(
                        worldX * blockScale,
                        worldY * blockScale,
                        worldZ * blockScale
                    );

                    var px = world.getBlock(worldX + 1, worldY, worldZ);
                    var nx = world.getBlock(worldX - 1, worldY, worldZ);
                    var pz = world.getBlock(worldX, worldY, worldZ + 1);
                    var nz = world.getBlock(worldX, worldY, worldZ - 1);
                    var py = world.getBlock(worldX, worldY + 1, worldZ);
                    var ny = world.getBlock(worldX, worldY - 1, worldZ);

                    let tmpGeometry = 0

                    switch (block) {
                        case BLOCK.BlockType.WATER: tmpGeometry = tmpWaterGeometry; break;
                        case BLOCK.BlockType.SAND: tmpGeometry = tmpUnderwaterGeometry; break;
                        case BLOCK.BlockType.DIRT: tmpGeometry = tmpLandGeometry; break;
                        case BLOCK.BlockType.GRASS: tmpGeometry = tmpLandGeometry; break;
                    }

                    if ((!py || world.isTransparent(py)) && py != block) {
                        tmpGeometry.merge(pyTmpGeometry, matrix);
                    }

                    if ((!ny || world.isTransparent(ny)) && ny != block) {
                        tmpGeometry.merge(nyTmpGeometry, matrix);
                    }

                    if ((!px || world.isTransparent(px)) && px != block) {
                        tmpGeometry.merge(pxTmpGeometry, matrix);
                    }

                    if ((!nx || world.isTransparent(nx)) && nx != block) {
                        tmpGeometry.merge(nxTmpGeometry, matrix);
                    }

                    if ((!pz || world.isTransparent(pz)) && pz != block) {
                        tmpGeometry.merge(pzTmpGeometry, matrix);
                    }

                    if ((!nz || world.isTransparent(nz)) && nz != block) {
                        tmpGeometry.merge(nzTmpGeometry, matrix);
                    }

                }

            }

        }

        tmpLandGeometry.mergeVertices()
        tmpUnderwaterGeometry.mergeVertices()
        tmpWaterGeometry.mergeVertices()

        var geometryLand = new THREE.BufferGeometry().fromGeometry(tmpLandGeometry);
        // geometryLand.computeBoundingSphere();

        var geometryDirt = new THREE.BufferGeometry().fromGeometry(tmpUnderwaterGeometry);
        // geometryDirt.computeBoundingSphere();

        var geometryWater = new THREE.BufferGeometry().fromGeometry(tmpWaterGeometry);
        // geometryWater.computeBoundingSphere();


        var meshLand = new THREE.Mesh(geometryLand, matLand);
        scene.add(meshLand);

        var meshDirt = new THREE.Mesh(geometryDirt, matDirt);
        scene.add(meshDirt);

        var meshWater = new THREE.Mesh(geometryWater, matWater);
        scene.add(meshWater);
    }
}

module.exports = {
    Chunk: Chunk,
    ChunkBlockWidth: chunkBlockWidth,
    ChunkBlockDepth: chunkBlockDepth,
    ChunkBlockHeight: chunkBlockHeight,
    blockScale: blockScale
}

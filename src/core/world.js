let BLOCK = require('./block')
let chunkClass = require('./chunk')

let worldChunkWidth = 1, worldChunkDepth = 1, worldChunkHeight = 1

let waterLevel = 10

class World {
    constructor() {
        this.chunks = []

        for (var x = 0; x < worldChunkWidth; x++) {
            for (var y = 0; y < worldChunkDepth; y++) {
                for (var z = 0; z < worldChunkHeight; z++) {
                    let chunk = new chunkClass.Chunk(x, y, z) 
                    this.chunks[x + z * worldChunkWidth + y * worldChunkWidth * worldChunkDepth] = chunk
                }
            }
        }
    }
    

    getChunk(x, y, z) {
        let indexX = x / chunkClass.ChunkBlockWidth;
        let indexZ = z / chunkClass.ChunkBlockDepth;
        let indexY = y / chunkClass.ChunkBlockHeight;

        return (this.chunks[indexX + indexZ * worldChunkWidth + indexY * worldChunkWidth * worldChunkDepth]) | 0;  
    }

    getBlock(x, y, z) {
        let chunk = this.getChunk(x, y, z)
        
        if (!chunk) {
            return 0
        }

        let localX = x - chunk.xWS()
        let localZ = z - chunk.zWS()
        let localY = y - chunk.yWS()

        return (chunk.getBlock(localX, localY, localZ)) | 0;  
    }

    isTransparent(blockID) {
        return blockID == BLOCK.BlockType.WATER
    }

    generateWorld(heightFunc) {
        console.log("GENERATE WORLD")
        let size = worldChunkWidth * worldChunkWidth * worldChunkDepth

        for (var i = 0; i < size; i++) {
            this.chunks[i].generateChunk(heightFunc, waterLevel)
        }
    }

    generateMeshes(scene) {
        console.log("GENERATE MESHES")
        let size = worldChunkWidth * worldChunkWidth * worldChunkDepth

        for (var i = 0; i < size; i++) {
            this.chunks[i].generateMesh(scene, this)
        }
    }

}

let Instance = new World()



module.exports = {
    World: World,
    Instance: Instance,
    WorldChunkWidth: worldChunkWidth,
    WorldChunkDepth: worldChunkDepth,
    WorldChunkHeight: worldChunkHeight,
}



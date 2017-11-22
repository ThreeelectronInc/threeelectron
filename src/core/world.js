let BLOCK = require('./block')

class World {
    constructor() {
        
    }

    getChunk(x, y, z) {
        let localX = x % chunkWidth;
        let localZ = z % chunkDepth;
        let localY = y % chunkHeight;

        return (chunks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
    }

    getBlock(x, y, z) {
        let localX = x % this.chunkWidth;
        let localZ = z % this.chunkDepth;
        let localY = y % this.chunkHeight;

        return (this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
    }

    isTransparent(blockID) {
        return blockID == BLOCK.BlockType.WATER
    }


}

let Instance = new World()

module.exports = {
    World: World,
    Instance: Instance
}



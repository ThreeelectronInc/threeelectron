  
let chunkWidth = 256, chunkDepth = 256, chunkHeight = 128
let chunkHalfWidth = chunkWidth / 2, chunkHalfDepth = chunkDepth / 2, chunkHalfHeight = chunkHeight / 2
let octaves = 4


class Chunk {
    constructor() {
       this.blocks = []
    }

    generateChunk(heightFunc, waterLevel) {
        for (var z = 0; z < chunkDepth; z++) {
            for (var x = 0; x < chunkWidth; x++) {
                let h = heightFunc(x, z)

                let y = 0

                for (y = 0; y < h -1; y++) {
                    this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.DIRT
                }

                if (h < waterLevel) {
                    this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.SAND
                    for (y = h; y < waterLevel; y++) {
                        this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.WATER
                    }
                    h = waterLevel
                }
                else {
                    this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.GRASS
                }

                for (y = h; y < chunkHeight; y++) {
                    this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth] = BlockType.EMPTY
                }
            }
        }
    }

    getBlock(x, y, z) {
        let localX = x % this.chunkWidth;
        let localZ = z % this.chunkDepth;
        let localY = y % this.chunkHeight;

        return (this.blocks[x + z * chunkWidth + y * chunkWidth * chunkDepth]) | 0;  
    }
}

module.exports = {
    Chunk: Chunk
}

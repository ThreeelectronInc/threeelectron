let noise = require('./../libs/improved_noise')
let perlin = new noise.ImprovedNoise()

let randSeed = Math.random(), randX = Math.random(), randZ = Math.random()


function lerp (a,  b,  c) {
    c = c < 0 ? 0 : c
    c = c > 1 ? 1 : c
    return a + c * (b - a);
}

function getHeight(x, z) {

    let h = 0
    let q = 1

    for (var j = 0; j < 1; j++) {

        h += (perlin.noise(randX + x / q, randZ + z / q, randSeed) + 0.4) * q;
        q *= 4;
    }

  //  h = lerp(-1, h, x / 100)
   // h = lerp(-1, h, z / 100)
  //  h = lerp(-1, h, (WORLD.totalWidth - x) / 100)
  //  h = lerp(-1, h, (WORLD.totalDepth - z) / 100)

    return h;
}

module.exports = {
    getHeight,
}
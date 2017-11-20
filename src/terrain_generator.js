let THREE = require('./libs/three/three')


function generateTerrain(scene) {
    let grassTex = THREE.ImageUtils.loadTexture('assets/images/Grass.png');
    let dirtTex = THREE.ImageUtils.loadTexture('assets/images/Dirt.png');    

    let SimplexNoise = require('simplex-noise')
    let noise = new SimplexNoise();

    let fieldSize = 100
    let halfField = fieldSize / 2

    let sampleSpread = 15

    let matGrass = new THREE.SpriteMaterial({ map: grassTex, color: 0xffffff });
    spriteGrass = new THREE.Sprite(matGrass);

    let matDirt = new THREE.SpriteMaterial({ map: dirtTex, color: 0xffffff });
    spriteDirt = new THREE.Sprite(matDirt);

    for (let x = -halfField; x < halfField; x++) {
        for (let z = -halfField; z < halfField; z++) {
            let sprite;
            let scale = 1//0.005;
            let height = noise.noise2D(x / sampleSpread, z / sampleSpread) * scale

            // let color_val = (1 + height / scale) * 0.5// * 0xffffff            
            // let color =  new THREE.Color(color_val, color_val, color_val)

            // let matGrass = new THREE.SpriteMaterial({ map: grassTex, color: color });
            // spriteGrass = new THREE.Sprite(matGrass);
        
            // let matDirt = new THREE.SpriteMaterial({ map: dirtTex, color: color });
            // spriteDirt = new THREE.Sprite(matDirt);
            
            if (height > 0) {
                sprite = spriteGrass.clone()
            }
            else {
                sprite = spriteDirt.clone()                
            }
            
            sprite.position.set(x * 3, height * 9, z * 3);
            sprite.scale.set(1, 1, 1.0);

            scene.add(sprite);
        }
    }
}

module.exports = {
    generateTerrain: generateTerrain,
}
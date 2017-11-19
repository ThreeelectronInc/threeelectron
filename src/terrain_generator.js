let THREE = require('./libs/three/three')


function generateTerrain(scene) {
    var grassTex = THREE.ImageUtils.loadTexture('assets/images/Grass.png');
    var dirtTex = THREE.ImageUtils.loadTexture('assets/images/Dirt.png');
    
    

    let SimplexNoise = require('simplex-noise')
    let noise = new SimplexNoise();


    for (let x = -100; x < 100; x++) {
        for (let y = -100; y < 100; y++) {
            let sprite;
            let scale = 0.005;
            let height = noise.noise2D(x / 30, y / 30) * scale

            let color = (1 + height / scale) * 0.5 * 0xffffff
            console.log(height)

            if (height > 0) {
                var terrainMaterial = new THREE.SpriteMaterial({ map: grassTex, useScreenCoordinates: false, color: color });
                sprite = new THREE.Sprite(terrainMaterial);
            }
            else {
                var dirtMat = new THREE.SpriteMaterial({ map: dirtTex, useScreenCoordinates: false, color: color });
                sprite = new THREE.Sprite(dirtMat);
            }
            
            sprite.position.set(x, y, 0);
            sprite.scale.set(1, 1, 1.0);

            scene.add(sprite);
        }
    }


}

module.exports = {
    generateTerrain: generateTerrain,
}
let THREE = require('./libs/three/three')


function generateTerrain(scene) {
    var grassTex = THREE.ImageUtils.loadTexture('assets/images/Grass.png');
    var dirtTex = THREE.ImageUtils.loadTexture('assets/images/Dirt.png');
    
    

    let SimplexNoise = require('simplex-noise')
    let noise = new SimplexNoise();

    let field_size = 60
    let half_field = field_size / 2

    let sampleSpread = 10

    for (let x = -half_field; x < half_field; x++) {
        for (let y = -half_field; y < half_field; y++) {
            let sprite;
            let scale = 1//0.005;
            let height = noise.noise2D(x / sampleSpread, y / sampleSpread) * scale

            let color_val = (1 + height / scale) * 0.5// * 0xffffff
            console.log(height)

            let color =  new THREE.Color(color_val, color_val, color_val)

            
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
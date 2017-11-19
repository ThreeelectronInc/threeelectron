let THREE = require('./libs/three/three')
 

function generateTerrain(scene) {
    var terrainTexture = THREE.ImageUtils.loadTexture( 'assets/images/Grass.png' );
    var terrainMaterial = new THREE.SpriteMaterial( { map: terrainTexture, useScreenCoordinates: false, color: 0xffffff } );
    
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            let sprite = new THREE.Sprite( terrainMaterial );
            sprite.position.set(x, y, 0);
            sprite.scale.set( 1, 1, 1.0 );
            scene.add( sprite);
        }
    }
}

module.exports = {
    generateTerrain : generateTerrain,
}
let THREE = require('./../../../libs/three/three')

let managed_sprites = []

// TODO: Use material manager to get materials
function init_sprite(index, image_path) {
    if (index in managed_sprites) { throw new Error("index already in use") }

    var texture = new THREE.TextureLoader().load(image_path)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.encoding = THREE.LinearEncoding

    let mat = new THREE.SpriteMaterial( { map: texture } )

    managed_sprites[index] =  new THREE.Sprite(mat)
}

function get_sprite(index) {
    if (!(index in managed_sprites)) { throw new Error("no sprite registered to index") }

    return managed_sprites[index].clone()
}

module.exports = {
    init_sprite : init_sprite,
    get_sprite : get_sprite
}
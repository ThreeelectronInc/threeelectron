let THREE = require('./../libs/three/three')

let managed_materials = []

function init_material(index, image_path, materialConstructor) {
    if (index in managed_materials) { throw new Error("index already in use") }

    var texture = new THREE.TextureLoader().load(image_path)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.encoding = THREE.LinearEncoding

    managed_materials[index] =  materialConstructor({ map: texture } )
}

function get_material(index) {
    if (!(index in managed_materials)) { throw new Error("no material registered to index") }

    return managed_materials[index]
}

module.exports = {
    init_material : init_material,
    get_material : get_material
}
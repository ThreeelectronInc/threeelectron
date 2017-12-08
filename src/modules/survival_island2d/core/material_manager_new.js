let THREE = require('./../../../libs/three/three')

let managed_materials = {}
let managed_textures = {}
let managed_constructors = {}

function init_material(index, image_path, materialConstructor) {
    if (index in managed_materials) { throw new Error("index already in use") }

    let texture = new THREE.TextureLoader().load(image_path)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.encoding = THREE.LinearEncoding
    texture.repeat.set(1,1)
    managed_textures[index] = texture
    managed_constructors[index] = materialConstructor

    managed_materials[index] =  materialConstructor({ map: texture } )
}

function get_material(index) {
    if (!(index in managed_materials)) { 
        if (!(index in managed_constructors) || !(index in managed_textures)) {
            throw new Error("no material registered to index")
        }

        managed_materials[index] =  managed_constructors[index]({ map: managed_textures[index] } )
    }

    return managed_materials[index]
}

function get_colored_material(index, col) {
    let key = index + '_' + col.getHexString()
    if (!(key in managed_materials)) { 
        if (!(index in managed_constructors) || !(index in managed_textures)) {
            throw new Error("no material registered to index")
        }

        managed_materials[key] =  managed_constructors[index]({ map: managed_textures[index], color: col } )
    }

    return managed_materials[key] 
}

module.exports = {
    init_material : init_material,
    get_material : get_material,
    get_colored_material: get_colored_material
}
/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

class RenderBuffer {

    constructor(renderer, scene, bufferSize){
        this.renderer = renderer
        this.bufferScene = scene


        this.bufferScale = bufferSize
        // Create the texture that will store our result
        this.bufferTexture = new THREE.WebGLRenderTarget(
            this.bufferScale, this.bufferScale, 
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
        )

        this.bufferCamera = new THREE.OrthographicCamera(
            -0.5, 0.5, 0.5, -0.5, 0, 10
        )
        this.bufferCamera.position.z = 1

    }

    render() {

        this.renderer.clearTarget(this.bufferTexture)
        this.renderer.render(this.bufferScene, this.bufferCamera, this.bufferTexture);
        
    }

}

module.exports = {
    RenderBuffer
}
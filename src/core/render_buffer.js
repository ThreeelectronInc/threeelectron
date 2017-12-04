let THREE = require('./../libs/three/three')


class RenderBuffer {

    constructor(renderer, scene){
        this.renderer = renderer
        this.bufferScene = scene


        this.bufferScale = 512
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
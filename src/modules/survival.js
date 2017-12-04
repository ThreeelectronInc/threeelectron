let THREE = require('./../libs/three/three')

let { BaseGame } = require('./../core/base_game')
let TerrainGenerator = require('./../core/terrain_generator')

let chunkClass = require('./../core/chunk')
let entityClass = require('./../core/entities/entity')

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.camSpeed = 500
        this.lookPos = new THREE.Vector3()

        this.chickenCount = 0
        this.chickensDone = false
        this.time_elapsed = 0


    }

    // Called when start() is called and the renderer has been initialised
    init() {

        // this.renderer.setClearColor("green")


        TerrainGenerator.generateTerrain(this.scene)
        console.log('moving on while terrain generates')
        // console.log(chicken.position)

        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(100, 500, 100)
        this.lookPos.set(TerrainGenerator.world.totalBlockWidth * 0.5, 0, TerrainGenerator.world.totalBlockDepth * 0.5)
        console.log(this.lookPos)

        this.chickens = []



        let matShader = new THREE.ShaderMaterial({

            uniforms: {

                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }

            },

            vertexShader: `	
            varying vec2 vUv;
            
                        void main()
                        {
                            vUv = uv;
                            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                            gl_Position = projectionMatrix * mvPosition;
                        }
            `,

            fragmentShader: `			
            uniform float time;
            
                        varying vec2 vUv;
            
                        void main( void ) {
            
                            vec2 position = - 1.0 + 2.0 * vUv;
            
                            float red = abs( sin( position.x * position.y + time / 5.0 ) );
                            float green = abs( sin( position.x * position.y + time / 4.0 ) );
                            float blue = abs( sin( position.x * position.y + time / 3.0 ) );
                            gl_FragColor = vec4( red, green, blue, 1.0 );
                        }
            `
        });


        let geomShader = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshShader = new THREE.Mesh(geomShader, matShader);
        this.scene.add(meshShader)
        // geomShader.scale.set()




        //// This is where we create our off-screen render target ////


        // Create a different scene to hold our buffer objects
        this.bufferScene = new THREE.Scene()

        let mapChicken = new THREE.TextureLoader().load("assets/chicken.png");
        let matChicken = new THREE.SpriteMaterial({ map: mapChicken, color: 0xffffff });
        let geomChicken = new THREE.Sprite(matChicken);
        // geomChicken.scale.set(50,50,50)

        this.bufferScale = 200

        this.bufferScene.add(geomChicken)
        // Create the texture that will store our result
        this.bufferTexture = new THREE.WebGLRenderTarget(this.bufferScale, this.bufferScale, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

        this.bufferCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        this.bufferCamera.position.z = 1

        this.bufferMaterial = new THREE.MeshLambertMaterial({ map: this.bufferTexture.texture, transparent: true, side: THREE.DoubleSide })
        



        this.matShader2 = new THREE.ShaderMaterial({
            
                        uniforms: {
            
                            time: { value: 1.0 },
                            resolution: { value: new THREE.Vector2() },
                            step: 0.1,
                            scale:1
            
                        },
                        
                                    vertexShader: `	
                                    varying vec2 texCoord;
                                    
                                                void main()
                                                {
                                                    texCoord = uv;
                                                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                                                    gl_Position = projectionMatrix * mvPosition;
                                                }
                                    `,
                        fragmentShader: `			
                        
        uniform sampler2D tex0;
        uniform vec2 pixel;
        uniform vec2 window;

        uniform float step;
        uniform float scale;

        uniform vec3 mouse;

        varying vec2 texCoord;

        uniform float time;

        uniform vec2 positionOffset;

        uniform float toColor;

        const int oc = 10;

        vec4 mod289(vec4 x)
        {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x)
        {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec2 fade(vec2 t) {
            return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Classic Perlin noise
        float cnoise(vec2 P)
        {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod289(Pi); // To avoid truncation effects in permutation
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;

            vec4 i = permute(permute(ix) + iy);

            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;

            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);

            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;
            g01 *= norm.y;
            g10 *= norm.z;
            g11 *= norm.w;

            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));

            vec2 fade_xy = fade(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }

        // Classic Perlin noise, periodic variant
        float pnoise(vec2 P, vec2 rep)
        {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
            Pi = mod289(Pi);        // To avoid truncation effects in permutation
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;

            vec4 i = permute(permute(ix) + iy);

            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;

            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);

            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;
            g01 *= norm.y;
            g10 *= norm.z;
            g11 *= norm.w;

            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));

            vec2 fade_xy = fade(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }

        float fbm(vec2 P, int octaves, float lacunarity, float gain)
        {
            float sum = 0.0;
            float amp = 1.0;
            vec2 pp = P;


            for(int i = 0; i < oc; i++)
            {
                amp *= gain;
                sum += amp * cnoise(pp);
                pp *= lacunarity;
            }
            return sum;

        }


        float pattern(in vec2 p) {
            float l = 2.5;
            float g = 0.4;
            //int oc = 10;

            vec2 q = vec2( fbm( p + vec2(0.0,0.0),oc,l,g),fbm( p + vec2(5.2,1.3),oc,l,g));
            vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2),oc,l,g ), fbm( p + 4.0*q + vec2(8.3,2.8) ,oc,l,g));
            return fbm( p + 4.0*r ,oc,l,g);
        }

        float pattern2( in vec2 p, out vec2 q, out vec2 r , in float time)
        {
            float l = 2.5;
            float g = 0.4;
            //int oc = 10;

            q.x = fbm( p + vec2(time,time),oc,l,g);
            q.y = fbm( p + vec2(5.2*time,1.3*time) ,oc,l,g);

            r.x = fbm( p + 4.0*q + vec2(1.7,9.2),oc,l,g );
            r.y = fbm( p + 4.0*q + vec2(8.3,2.8) ,oc,l,g);

            return fbm( p + 4.0*r ,oc,l,g);
        }

float interpolate( float val, float y0, float x0, float y1, float x1 ) {
  return (val-x0)*(y1-y0)/(x1-x0) + y0;
}

float base( float val ) {
    if ( val <= -0.75 ) return 0.0;
    else if ( val <= -0.25 ) return interpolate( val, 0.0, -0.75, 1.0, -0.25 );
    else if ( val <= 0.25 ) return 1.0;
    else if ( val <= 0.75 ) return interpolate( val, 1.0, 0.25, 0.0, 0.75 );
    else return 0.0;
}

float red( float gray ) {
    return base( gray - 0.5 );
}
float green( float gray ) {
    return base( gray );
}
float blue( float gray ) {
    return base( gray + 0.5 );
}

        void main() {

            vec2 q = scale * gl_FragCoord.xy / window;//vec2(640.0,480.0);
            vec2 p = -1.0 + 2.0 * q;
            vec2 qq;
            vec2 r;

            p += positionOffset;

            //float color = pattern2(p,qq,r,time);
            //vec4 c = vec4(color,color,color,color);

            // vec4 c = vec4(pattern2(p,qq,r,time+1.0*step ), pattern2(p,qq,r,time+2.0*step), pattern2(p,qq,r,time+3.0*step), 1.0);
            // vec4 c = vec4(pattern(p), pattern(p), pattern(p), 1.0);

            float final = pattern2(p,qq,r,time+1.0*step);

            final *= 3.5;
            vec4 c = vec4(vec3(final),1.0);

            if (toColor > 0.5){
                gl_FragColor = vec4(red(c.x), green(c.x), blue(c.x), 1.0);
            }
            else{
                gl_FragColor = c; //clamp(c, 0, 1);
            }
        }
                        `
                    });
            


        this.bufferBackgroundPlane = new THREE.PlaneGeometry(0.9, 0.9, 1)
        this.backgroundRRT = new THREE.Mesh(this.bufferBackgroundPlane, this.matShader2);
        this.bufferScene.add(this.backgroundRRT)




        let geomRTT = new THREE.PlaneGeometry(1000, 1000, 1000);
        let meshRTT = new THREE.Mesh(geomRTT, this.bufferMaterial);

        meshRTT.position.set(1000, 1000, 1000)
        this.scene.add(meshRTT)



    }



    deInit() {
    }

    update(delta) {


        // Make short named wrapper since we'll be calling this method a lot here
        const keyD = (key) => this.keyDown(key)

        let camVel = this.camSpeed * delta

        let forwardVec = new THREE.Vector3()
        let mouseVec = new THREE.Vector3()
        let lookVec = new THREE.Vector3()
        let upVec = new THREE.Vector3(0, 1, 0)
        let leftVec = upVec.clone()

        lookVec.subVectors(this.lookPos, this.camera.position)

        forwardVec = lookVec.clone()
        forwardVec.y = 0


        forwardVec = forwardVec.normalize().multiplyScalar(delta * 500)

        mouseVec = forwardVec.clone()

        leftVec.cross(forwardVec)

        // TODO: Make pan and zoom methods

        if (keyD("w")) { this.camera.position.add(forwardVec); this.lookPos.add(forwardVec) }
        if (keyD("s")) { this.camera.position.sub(forwardVec); this.lookPos.sub(forwardVec) }
        if (keyD("a")) { this.camera.position.add(leftVec); this.lookPos.add(leftVec) }
        if (keyD("d")) { this.camera.position.sub(leftVec); this.lookPos.sub(leftVec) }

        if (keyD("e")) { this.camera.position.y += camVel }
        if (keyD("q")) { this.camera.position.y -= camVel }

        const mousePadSpeed = 0.25
        if (this.isMouseDown[0]) {
            let mousePan = forwardVec.clone().multiplyScalar(this.mouse.yVel * mousePadSpeed)
                .add(leftVec.clone().multiplyScalar(this.mouse.xVel * mousePadSpeed))


            this.camera.position.add(mousePan);

            this.lookPos.add(mousePan)
        }
        if (this.isMouseDown[2]) {

            let rotVec = lookVec.clone()
            rotVec.applyAxisAngle(upVec, this.mouse.xVel * 0.005)

            this.camera.position.subVectors(this.lookPos, rotVec)


            // this.camera.position.y += this.mouse.yVel * -2

            let testZoomDistanceVec = lookVec.clone()
            testZoomDistanceVec.y = 0
            // console.log(testZoomDistanceVec.length())
            if (testZoomDistanceVec.length() > 50 || this.mouse.yVel < 0) {

                mouseVec.multiplyScalar(this.mouse.yVel * 0.5)

                this.camera.position.add(mouseVec)


            }
        }

        // mouseVec.multiplyScalar(this.mouse.wheel * 0.05)
        // this.camera.position.add(mouseVec)

        this.camera.position.y += this.mouse.wheel * 0.25


        this.camera.lookAt(this.lookPos);


        if (!this.chickensDone) { // TerrainGenerator.world.done && 
            console.log("start generating chickens")

            for (let x = 0; x < TerrainGenerator.world.totalWidth; x++) {

                for (let z = 0; z < TerrainGenerator.world.totalDepth; z++) {

                    let minY = TerrainGenerator.world.waterLevel - 1
                    let maxY = TerrainGenerator.world.waterLevel + 10

                    for (let y = minY; y < maxY; y++)

                        if (TerrainGenerator.getHeight(x, z) === y + 1 && !this.chickensDone) {//&& TerrainGenerator.world.getChunk(x,TerrainGenerator.world.waterLevel,z)) {
                            let chicken = new entityClass.Entity(this.scene, x * chunkClass.blockScale, chunkClass.blockScale + (y + 20) * chunkClass.blockScale, z * chunkClass.blockScale)
                            this.chickens.push(chicken)

                            // console.log('chicken count: ', entityClass.chickenCount)

                        }

                    if (entityClass.chickenCount > 500) {
                        this.chickensDone = true
                        break;
                    }

                }

                if (this.chickensDone) {
                    break
                }
            }
        }

        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].update(delta)
        }

        // this.renderer.clear()
        // this.renderer.render(this.scene, this.camera, this.bufferTexture);

        // this.bufferRenderer.clear()
        // this.bufferRenderer.render(this.scene, this.camera, this.bufferTexture);


        // # set a uniform to tell the shader the size of a single pixel
        this.matShader2.uniforms['pixel'] = {value: new THREE.Vector2( 1.0/this.bufferScale, 1.0/this.bufferScale)}
        this.matShader2.uniforms['window'] = {value: new THREE.Vector2( this.bufferScale, this.bufferScale)}
        

        this.time_elapsed += delta
        this.matShader2.uniforms['time'] = {value: this.time_elapsed * 0.1}

        // self.shader.uniformf('positionOffset', 0, 0)

        this.matShader2.uniforms['scale'] = {value: 0.5}
        
        this.matShader2.uniforms['toColor'] = {value: 1}
        this.matShader2.uniforms['step'] = {value: 0.1}
        
    
        // this.renderer.clear()
        this.renderer.clearTarget(this.bufferTexture)
        this.renderer.render(this.bufferScene, this.bufferCamera, this.bufferTexture);
        // this.renderer.clear()

    }
}

module.exports = {
    SurvivalGame: SurvivalGame
}
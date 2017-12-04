let THREE = require('./../../libs/three/three')

let make = () => {
    return new THREE.ShaderMaterial({

        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() },
            step: 0.1,
            scale: 1

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
        gl_FragColor = c + vec4(0.5,0.5,0.5,1); //clamp(c, 0, 1);
    }
}
                `
    });



}


module.exports = {
    make
}
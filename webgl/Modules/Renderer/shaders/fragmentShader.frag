uniform sampler2D uScene0;
uniform sampler2D uScene1;
uniform float uTime;
uniform float uTransition;
uniform float uTemplate;
varying vec2 vUv;

// ------------------------------

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
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

void main() {
    float inverseuTransi = -uTransition+1.0; 
    float cloudSizeMultiplicator = pow((inverseuTransi-0.5)*2.0,8.0)* -0.35 +0.35;

    vec2 uv = vUv;
    vec4 scene0 = texture2D(uScene0,vec2(uv.x,uv.y+uTransition)) ;
    vec4 scene1 = texture2D(uScene1, vec2(uv.x,uv.y-(1.0-uTransition)));


    vec4 transiWithColor = vec4(step(inverseuTransi,uv.y),step(uv.y,inverseuTransi),0.0,1.0);

    //vec4 test = vec4(step(uTransition,uv.y)*topImage.x+step(uv.y,uTransition)*bottomImage.x,step(uTransition,uv.y)*topImage.y+step(uv.y,uTransition)*bottomImage.y,step(uTransition,uv.y)*topImage.z+step(uv.y,uTransition)*bottomImage.z,1.0);
    vec4 cloud = step(cnoise(uv*30.0),0.1) * vec4(0.81,0.87,0.96,1.0) + step(0.1,cnoise(uv*30.0)) * vec4(1.0);
    vec4 scenesTransi = scene0 * step(uv.y,inverseuTransi) + step(inverseuTransi,uv.y) * scene1;
    float isInCloudBand = max(sign(uv.y-(inverseuTransi-(cloudSizeMultiplicator+sin(uv.x*40.0)*cloudSizeMultiplicator*0.05))),0.0) * max(sign((inverseuTransi+cloudSizeMultiplicator+sin(uv.x*40.0)*cloudSizeMultiplicator*0.05)-uv.y),0.0);
    scenesTransi *= (-isInCloudBand+1.0);
    scenesTransi+= isInCloudBand * cloud;
    
    
    

    gl_FragColor = scenesTransi;
    //gl_FragColor = transiWithColor;
}
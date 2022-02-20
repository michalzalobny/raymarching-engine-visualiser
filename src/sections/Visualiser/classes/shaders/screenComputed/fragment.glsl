uniform float uTime;

uniform vec3 uRo;
uniform vec3 uLookAt;
uniform vec3 uLightPos;
uniform vec3 uSphere1;
uniform vec3 uSphere2;
uniform float uZoom;

varying vec2 vUv;

#define MAX_STEPS 100 //integer
#define MAX_DIST 100.0 //float
#define SURF_DIST .01
#define PI 3.14159265359

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

//smooth min function
float smin(float a, float b, float k){ 
    float h = clamp( 0.5 + 0.5 * (b-a)/k, 0.0, 1.0);
    return mix(b,a,h) - k*h*(1.0 - h);
}

//smooth max function
float smax(float a, float b, float k){ 
    float h = clamp((b-a)/k + 0.5, 0.0, 1.0);
    return mix(a,b,h) + h*(1.0 - h) * k * 0.5;
}


//our 3d scene that is used to compute distanceces
float GetDist(vec3 p) {
    float planeDist = p.y; 

    //Boolean substraction
    float sphereDistA = length(p - uSphere1) - 1.0; //1.0 is default radius
    float sphereDistB = length(p - uSphere2) - 1.0; //1.0 is default radius
    float spheresDist = smin(sphereDistA, sphereDistB , 0.0); // smooth union
    float d = min(planeDist, spheresDist);
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    return dO;
}

//Samples the points around point p to get the line that is perpendicular to normal vector
vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(0.001, 0.0);
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    
    return normalize(n);
}

float GetLight (vec3 p) {
    //To compute the light power, we need the light vector (direction of the light) and the normal vector in the given point p (also the direction)

    vec3 l = normalize(uLightPos - p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l), 0.0, 1.0); 

    float d = RayMarch(p + n * SURF_DIST * 2.0, l); 
    if(d<length(uLightPos - p)) dif *= .1; //Shadow is 10% of an actual light
    return dif;
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0.0, 1.0, 0.0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}

void main()
{
    vec2 uv = vUv;
    uv -= 0.5;
    vec3 col = vec3(0.0);

    vec3 rd = GetRayDir(uv, uRo, uLookAt, uZoom);

    float d = RayMarch(uRo, rd); //The distance to the closest point that interesects with casted ray

    vec3 p = uRo + rd *d;
    float dif = GetLight(p); //diffused lighting
    // col = mix(vec3(0.839, 0.458, 0.941), vec3(0.976, 0.760, 0.976), dif);
    col = mix(vec3(0.364, 0.474, 0.937), vec3(0.835, 0.858, 0.964), dif);

    gl_FragColor = vec4(col, 1.0);
}
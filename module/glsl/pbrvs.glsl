#define PI 3.14159265359
#define PI2 6.28318530718
#define PI_HALF 1.5707963267949
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
// 饱和度，
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )

attribute vec3 position;
attribute vec3 normal;
attribute vec4 tangent;
attribute vec2 uv;
attribute vec2 uv2;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

uniform vec4 offsetRepeat;
uniform vec4 offsetRepeatDetail;

// varying vec3 FragPosition;
varying vec3 FragNormal;
varying vec4 FragTangent;
varying vec4 FragEyeVector;
varying vec2 vUv;

// Optimization just for this experiment
varying vec3 vEyeLightDir;
varying float vDotNL;
varying vec3 vComputeGGXResult;

#if NUM_DIR_LIGHTS > 0
#define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))

struct DirectionalLight {
    vec3 direction;
    vec3 color;

    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
    float intensity;
};

uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {

    vec3 H = normalize(eyeVector + eyeLightDir);
    float dotNH = saturate(dot(normal, H));
    // D
    float alphaSqr = precomputeGGX.y;
    float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;
    float D = alphaSqr / (PI * denom * denom);

    // F
    float dotLH = saturate(dot(eyeLightDir, H));
    float dotLH5 = pow(1.0 - dotLH, 5.0);
    vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);

    // V
    float visNL = G1V(dotNL, precomputeGGX.z);
    return D * F * visNL * precomputeGGX.w;
}

    #endif

    #if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)
varying vec2 vUvDetail;
#endif

varying vec2 vUv2;

#ifdef USE_SHADOWMAP

#if NUM_DIR_LIGHTS > 0

uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

#endif

#if NUM_SPOT_LIGHTS > 0

uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];
varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];

#endif

#if NUM_POINT_LIGHTS > 0

uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];
varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];

#endif
#endif

#ifdef USE_FOG

varying float fogDepth;

#endif

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    FragEyeVector = viewMatrix * worldPosition;

    // FragPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * FragEyeVector;

    vUv = uv.xy * offsetRepeat.zw + offsetRepeat.xy;

    #if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)
    vUvDetail = uv.xy * offsetRepeatDetail.zw + offsetRepeatDetail.xy;
    #endif

    FragNormal = normalMatrix * normal;
    FragTangent.xyz = normalMatrix * tangent.xyz;
    FragTangent.w = tangent.w;

    vUv2 = uv2.xy;

    #ifdef USE_SHADOWMAP

    #if NUM_DIR_LIGHTS > 0

    vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;

    #endif

    #endif


    #ifdef USE_FOG
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    fogDepth = -mvPosition.z;
    #endif


    #if NUM_DIR_LIGHTS > 0

    // Precompute sun in VS because we have no normal map

    DirectionalLight dirLight;

    dirLight = directionalLights[0];

    vec3 normalizedNormal = normalize(FragNormal);

    vEyeLightDir = dirLight.direction;
    vDotNL = dot(dirLight.direction, normalizedNormal);

    vec3 eyeVector = normalize(-FragEyeVector.rgb);

    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);

    vComputeGGXResult = computeGGX(prepGGX, normalizedNormal, eyeVector, dirLight.direction, vec3(0.05), vDotNL);

    #endif

}

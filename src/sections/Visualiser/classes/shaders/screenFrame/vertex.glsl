uniform float uTime;
uniform float uRandom;

varying vec2 vUv;

void main() {

  vec3 stablePosition = position;

  vec4 newPosition = modelViewMatrix * vec4(stablePosition, 1.0);

  gl_Position = projectionMatrix * newPosition;

  vUv = uv;
}

#ifdef USE_MAP
  varying vec2 vUv;

  uniform sampler2D map;
#endif
// 扩散
uniform vec3 diffuse;
// 不透明度
uniform float opacity;

void main() {
  // 颜色
  gl_FragColor = vec4(diffuse, opacity);

  #ifdef USE_MAP
    // 2d 地图纹理
    vec4 mapTexel = texture2D(map, vUv, -2.0);

    gl_FragColor *= mapTexel;
  #endif
}

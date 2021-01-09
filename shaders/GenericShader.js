import { FrontSide, Vector2 } from "three"

export const uniforms = {
  iTime: { type: 'float', value: 0 },
  iResolution: { type: 'vec2', value: new Vector2() }
}

export default {
  uniforms,
  depthWrite: false,
  depthTest: false,
  side: FrontSide,
  transparent: true,
  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
//   void main() {
//     gl_Position = vec4( position, 1.0 );
//  }
  `,
  fragmentShader:`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform float iTime;
  uniform vec2 iResolution;

  float rand () {
    return fract(sin(iTime)*1e4);
  }
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
      
    vec4 color = vec4(0.075,0.075,0.075,0.5);
    
    float strength = 20.0;
    
    float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (iTime * 10.0);
    vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
      
    float scanline = sin( uv.y * 800.0 * rand())/12.0;
    color += grain;
    color *= 1. - scanline;
    // grain = 1.0 - grain;
  
    // fragColor = color * grain;
    color.r = 1.0*uv.x;
    fragColor = color;
  }

  void main() {
    mainImage(gl_FragColor,gl_FragCoord.xy); // = vec4(0.0, 1.0, 0.0, 1.0);
 }

  `
}
import ThreeContainer from "../components/ThreeContainer";
import * as THREE from 'three';
import { useCallback, useEffect, useRef, useState } from 'react'
import { OrbitControls } from 'three/jsm/controls/OrbitControls.js'
import genericShader, { uniforms as genericUniforms } from '../shaders/GenericShader'
import makeShader from '../utils/makeShader'

import meyda from 'meyda'
import { useCallbackRef } from "use-callback-ref";
import useDrawCanvas2D from "../scripts/useDrawCanvas2D";



// {
//   canvas,
//   canvasB,
//   ctx,
//   ctxB,
//   // frame,
// }


function getTexture(canvas) {
  var tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  tex.flipY = false;
  return tex;
}
function drawIntoVoid({ctx, canvas, w, h, r = 0, ox = 0, oy = 0}, t = Date.now(), amount = -8, alpha = 1, ){
  // if(typeof r != 'number'){
  //   r = Math.sin(t/1000)*(Math.PI/50000);
  // }
  //let mag = 1;//t%24000 < 12000 ? 4 : 64;
  ctx.translate(w/2 + ox, h/2 + oy);
  ctx.rotate(r*0.0001);
  ctx.translate(-w/2 -ox, -h/2 -oy);
  ctx.globalAlpha = alpha;
  ctx.drawImage(canvas, amount, amount, w-(amount*2), h-(amount*2));
}
export default function Home() {
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [renderTarget, setRenderTarget] = useState(null)
  const {drawAudioData, canvas} = useDrawCanvas2D()
  useEffect(() => {
    if(drawAudioData && canvas){
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        // console.log('You let me use your mic!', stream)
        const audioCtx = new AudioContext();
        const audioSource = audioCtx.createMediaStreamSource(stream);
        // // console.log('audioSource', audioSource)
        //audioSource.connect(audioCtx.destination)
        const analyzer = Meyda.createMeydaAnalyzer({
          "audioContext": audioCtx,
          "source": audioSource,
          "bufferSize": 512,
          "featureExtractors": ["loudness", "spectralCentroid", "chroma", "rms", "energy", "perceptualSharpness", "zcr", "spectralFlatness", "spectralSkewness"],
          "callback": features => drawAudioData(features)
  
        });
        analyzer.start();
      })
      .catch(function (err) {
        // console.log('No mic for you!', err)
      });
    }
  }, [drawAudioData, canvas])

  // const onAudioProcessed = useCallback(features => {
  //   if(data.current.canvas){
      
  //   }
  //   }, [data.current])
  // will reset uniforms every time Home renders?
  const uniforms = genericUniforms

  // const canvas2dRootRef = useRef()

  useEffect(() => {
    // for audio visualising, 512
    meyda.bufferSize = 512;

    let happy = true

  

    function onClick() {
      happy = false
    }

    window.addEventListener('click', onClick)

    // return () => {
    //   window.removeEventListener('click', onClick)

    //   window.removeEventListener('resize', onResize)
    // }
  }, [])

  return <>
    <div/>
     <ThreeContainer
      onInit={({ scene, renderer, camera, renderTarget }) => {

        uniforms.iScene.value = renderTarget.texture
        renderer.setPixelRatio(window.devicePixelRatio)

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light

        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(1, 4, 4);

        scene.add(spotLight);

        scene.add(cube);

        camera.position.z = 5;

        const shader = makeShader(genericShader, {
          materialOnly: false
        })

        // cube.material = shaderMaterial
        camera.add(shader)

        // const shader = cube

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        //  scene.add(camera)
        // console.log(camera, shader)


        // scene.add(quad);

        setCamera(camera);
        setScene(scene);
        setRenderer(renderer);
        setRenderTarget(renderTarget)
        setSceneData(sd => ({
          ...sd,
          scene1: {
            geometry,
            material,
            cube,
            shader
          }
        }))
      }}
      onResize={(width, height) => {
        const resolution = uniforms.iResolution.value;
        resolution.set(width, height)
        if (renderer && camera) {
          renderer.setSize(width, height);
          const canvas = renderer.domElement;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.position = 'absolute';
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }}
      onAnimationFrame={() => {
        if (renderer && scene && camera && sceneData && renderTarget) {
          const { scene1: { cube, shader } } = sceneData;

          cube.rotation.y += 0.01;
          uniforms.iTime.value = performance.now() / 1000
          if (typeof canvas !== 'undefined') {
            console.log('canvas', canvas)
            uniforms.iScene.value = new THREE.Texture(canvas)
          }
          // shader.material.uniforms = uniforms
          uniforms.iScene.value.needsUpdate = true;
          // for(let uniform in currentUniforms){
          //   shader.material.uniforms[uniform].value = currentUniforms[uniform];
          // }

          renderer.render(scene, camera);
          if (typeof canvas !== 'undefined') {
            drawIntoVoid({ ctx: canvas.getContext('2d'), canvas: renderer.domElement,
              w: window.innerWidth,
              h: window.innerHeight,
              r: 0.0001,
              ox: 0.998,
              oy: 0.998,
            })
          }
        }
      }}
    />
    </>
}

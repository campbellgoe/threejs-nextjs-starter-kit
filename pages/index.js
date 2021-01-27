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

export default function Home() {
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [renderTarget, setRenderTarget] = useState(null)
  const someElement = useCallbackRef(null, () => {

    const drawAudioData = () => null//useDrawCanvas2D()
        // set up audio stream from the mic (asks user)
    // process the audio with Meyda to extract features
    // draw the visualisation
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      // console.log('You let me use your mic!', stream)
      const audioCtx = new AudioContext();
      const audioSource = audioCtx.createMediaStreamSource(stream);
      // // console.log('audioSource', audioSource)
      audioSource.connect(audioCtx.destination)
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

 

    
    
    
  })
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
    <div ref={someElement}/>
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
          uniforms.iScene.value = new THREE.Texture(renderer.domElement)
          // shader.material.uniforms = uniforms
          uniforms.iScene.value.needsUpdate = true;
          // for(let uniform in currentUniforms){
          //   shader.material.uniforms[uniform].value = currentUniforms[uniform];
          // }

          renderer.render(scene, camera);
        }
      }}
    />
    </>
}

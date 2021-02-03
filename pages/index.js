import ThreeContainer from "../components/ThreeContainer";
import * as THREE from 'three';
import { useRef, useState } from 'react'
import { OrbitControls } from 'three/jsm/controls/OrbitControls.js'
import genericShader, { uniforms as genericUniforms } from '../shaders/GenericShader'
import makeShader from '../utils/makeShader'

export default function Home() {
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const uniforms = useRef(genericUniforms)

  return <ThreeContainer
      onInit={({ scene, renderer, camera })=>{
        const canvas = renderer.domElement;
        canvas.style.left = '50%'
        canvas.style.top = '50%'
        canvas.style.transform = 'translate(-50%, -50%)'
        renderer.setPixelRatio(window.devicePixelRatio)
        const texture = new THREE.TextureLoader().load( '/boxes.png' );
        const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        const material = new THREE.MeshStandardMaterial( { map: texture } );
        const cube = new THREE.Mesh( geometry, material );

        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

        scene.add( ambientLight );

        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set(1,4,4);

        scene.add( spotLight );

        scene.add( cube );
        
        camera.position.z = 0.1;
        camera.zoom = 16

        const shader = makeShader(genericShader, {
          materialOnly: false
        })

        // cube.material = shaderMaterial
        camera.add(shader)

        // const shader = cube

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.update();

        const size = 0.1;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper( size, divisions );
        scene.add( gridHelper );
        
        //  scene.add(camera)
// console.log(camera, shader)
       
    
        // scene.add(quad);
        
        setCamera(camera);
        setScene(scene);
        setRenderer(renderer);
        setSceneData(sd => ({...sd,
          scene1: {
            geometry,
            material,
            cube,
            shader,
            gridHelper
          }
        }))
      }}
      onResize={(width, height, minWH) => {
        // const resolution = uniforms.current.iResolution.value;
        if(renderer && camera){
          renderer.setSize( minWH, minWH );
          const canvas = renderer.domElement;
          canvas.width = minWH;
          canvas.height = minWH;
          canvas.style.position = 'absolute';
          camera.aspect = 1;//width / height;
          camera.updateProjectionMatrix();
        }
      }}
      onAnimationFrame={()=>{
        if(renderer && scene && camera && sceneData){
          const { scene1: { cube, shader } } = sceneData;
          
          // cube.rotation.y += 0.01;
          const currentUniforms = uniforms.current
          // currentUniforms.iTime.value = performance.now()/1000
          // for(let uniform in currentUniforms){
          //   shader.material.uniforms[uniform].value = currentUniforms[uniform];
          // }

          // renderer.render( scene, camera );
          if(currentUniforms){
            currentUniforms.iTime.value = performance.now() / 1000
            currentUniforms.iScene.value = new THREE.Texture(renderer.domElement)
            
            // shader.material.uniforms = uniforms
            currentUniforms.iScene.value.needsUpdate = true;
          }
          // for(let uniform in currentUniforms){
          //   shader.material.uniforms[uniform].value = currentUniforms[uniform];
          // }
          // 
          renderer.render(scene, camera);
          //renderer.setRenderTarget(renderTarget)
          //renderer.render(scene, camera);
          // uniforms.iDistorted.value = new THREE.Texture(renderer.domElement)
        }
      }}
      />
}

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

        renderer.setPixelRatio(window.devicePixelRatio)


        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

        scene.add( ambientLight );

        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set(1,4,4);

        scene.add( spotLight );


        
       
        
        camera.position.z = 5;

        const vertexShader = `
varying vec3 vNormal;

void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader
const fragmentShader = `
varying vec3 vNormal;

uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 objectColor;

void main() {
    // Normalize the normal and the light direction
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(lightDirection);

    // Calculate the ambient color component
    vec3 ambient = ambientColor * objectColor;

    // Calculate the diffuse color component
    float diffIntensity = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diffIntensity * lightColor * objectColor;

    // Calculate the specular color component (using Phong reflection model)
    vec3 viewDir = normalize(-vNormal); // View direction is the vector pointing towards the camera
    vec3 reflectDir = reflect(-lightDir, norm);
    float specIntensity = pow(max(dot(viewDir, reflectDir), 0.0), 32.0); // Specular power of 32
    vec3 specular = specIntensity * lightColor;

    // Final color is the sum of ambient, diffuse, and specular components
    vec3 resultColor = ambient + diffuse + specular;

    gl_FragColor = vec4(resultColor, 1.0);
}
`;

// Create the ShaderMaterial
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        lightDirection: { value: new THREE.Vector3(1, 1, 1) }, // Adjust the light direction as needed
        lightColor: { value: new THREE.Color(0xffffff) }, // Light color (white in this case)
        ambientColor: { value: new THREE.Color(0x222222) }, // Ambient light color
        objectColor: { value: new THREE.Color(0x00ff00) }, // Cube color
    },
});

// Create the cube and apply the shader material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, shaderMaterial);

// Add the cube to your scene
scene.add(cube);

        // const shaderMaterial = makeShader(genericShader, {
        //   materialOnly: true
        // })

        // // cube.material = shaderMaterial

        // const geometry = new THREE.BoxGeometry();
        // const cube = new THREE.Mesh( geometry, shaderMaterial );
        // scene.add( cube );

        // const shader = cube

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.update();
        
        //  scene.add(camera)
// console.log(camera, shader)
       
    
        // scene.add(quad);
        
        setCamera(camera);
        setScene(scene);
        setRenderer(renderer);
        setSceneData(sd => ({...sd,
          scene1: {
            geometry,
            cube,
          }
        }))
      }}
      onResize={(width, height) => {
        const resolution = uniforms.current.iResolution.value;
        resolution.set(width, height)
        if(renderer && camera){
          renderer.setSize(width, height);
          const canvas = renderer.domElement;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.position = 'absolute';
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }}
      onAnimationFrame={()=>{
        if(renderer && scene && camera && sceneData){
          const { scene1: { cube } } = sceneData;
          
          //cube.rotation.y += 0.01;
          const currentUniforms = uniforms.current
          currentUniforms.iTime.value = performance.now()/1000
          // for(let uniform in currentUniforms){
          //   shader.material.uniforms[uniform].value = currentUniforms[uniform];
          // }

          renderer.render( scene, camera );
        }
      }}
      />
}

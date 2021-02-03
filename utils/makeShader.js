// camera must already be attached to scene for it to work
export default function makeShader(shaderMaterial, { materialOnly, perspective }) {
  const material = new THREE.ShaderMaterial(shaderMaterial);
  if(materialOnly){
    return material
  }
  const geometry = new THREE.PlaneBufferGeometry(2,2);
  const shaderPlane = new THREE.Mesh( geometry, material );
  shaderPlane.rotation.y = Math.PI;
  shaderPlane.rotation.x = Math.PI
  // shaderPlane.position.x=0.5;
  // shaderPlane.position.y=0.5;
  shaderPlane.position.z= perspective ? -0.5 : 0;//-0.5;
  return shaderPlane
}
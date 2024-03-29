// camera must already be attached to scene for it to work
export default function makeShader(shaderMaterial, { materialOnly }) {
  const material = new THREE.ShaderMaterial(shaderMaterial);
  if(materialOnly){
    return material
  }
  const geometry = new THREE.PlaneGeometry(2,2,1,1);
  const shaderPlane = new THREE.Mesh( geometry, material );
  shaderPlane.rotation.y = Math.PI;
  shaderPlane.rotation.x = Math.PI
  // shaderPlane.position.x=0.5;
  // shaderPlane.position.y=0.5;
  shaderPlane.position.z=-0.5;
  return shaderPlane
}
export default function JsonToGlsl({uniforms}){
  let output = ''
  for(let uniformName in uniforms){
    output += `uniform ${uniforms[uniformName].type} ${uniformName}; \r\n`
  }
  return output
}
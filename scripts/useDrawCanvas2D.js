import { useEffect, useState } from "react";

function generateCanvas(el) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.style.background = 'transparent';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight

  if (el) el.appendChild(canvas)

  return { canvas, ctx }
}
export default function useDrawCanvas2D(){
  const [data, setData] = useState(null)
  useEffect(() => {
    if(document){
      const { canvas, ctx } = generateCanvas(document.documentElement)
      const { canvas: canvasB, ctx: ctxB } = generateCanvas()
      setData({ canvas, ctx, canvasB, ctxB, drawAudioData })
      function drawAudioData({
        chroma,
        loudness,
        spectralCentroid,
        rms,
        energy,
        perceptualSharpness,
        zcr,
        spectralFlatness,
        spectralSkewness
      }) {
        const width = canvas.width;
        const height = canvas.height
        ctx.save()
        const normalisedZcr = zcr / ((512 / 2) - 1)
        // ctx.globalCompositeOperation = 'luminosity';
        const normalisedLoudness = loudness.total / 24
        // not really normalised
        const normalisedSpectralCentroid = spectralCentroid / 40;//.total / 24
      
        /*
        //if(Math.floor(performance.now()) % 1 === 0){
        function drawBackgrond(){
          ctx.beginPath()
          ctx.lineWidth = loudness*24
          console.log(frame%2===0)
          // console.log(performance.now(), 'and ', Math.floor(performance.now())/2)
          if(frame%2===0){
            ctx.strokeStyle = `hsla(${Math.sin(spectralCentroid)*360}deg ${Math.cos(spectralCentroid)*50+50}% ${Math.sin(spectralCentroid+Math.PI/2)*50+50}% / ${loudness*perceptualSharpness}%)`
          } else {
            ctx.strokeStyle = `rgba(${Math.sin(spectralCentroid)*255},${Math.cos(spectralCentroid)*255},${Math.sin(spectralCentroid+Math.PI/2)*255},${loudness*perceptualSharpness**0.5/4})`
          }
          const bg = {
            x: Math.random()*width,
            y: Math.random()*height,
            radius: loudness * width/2,
          }
          ctx.moveTo(bg.x + bg.radius, bg.y)
          ctx.arc(bg.x, bg.y, bg.radius, 0, Math.PI*2)
          ctx.stroke()
          ctx.closePath()
        }
        //ctx.clearRect(0, 0, width, height)
        // drawBackgrond()
        //}
        function drawChroma(){
          chroma.forEach((chromaValue, chromaIndex, arr) => {
            const t = chromaIndex / arr.length
            const x = width * t
            const hue = t * 360
            const saturation = 50
            const luminosity = 50
            const opacity = loudness
            ctx.fillStyle = `hsla(${hue}deg ${saturation}% ${luminosity}% / ${opacity}%)`
            // // console.log(ctx.fillStyle)
            // // console.log(value)
            const y = height * (loudness * chromaValue - 1) * -1
            // console.log(chromaValue)
            ctx.fillRect(x, y, width * (1/arr.length), height - y)
      
            
          })
        }
        // drawChroma()
        
        function drawLoudness(){
          
          // console.log('loudness:', loudness)
          const x = 0
          const hue = loudness * -1 * 360
          const saturation = 50
          const luminosity = 50
          const opacity = loudness
          ctx.strokeStyle = `hsla(${hue}deg ${saturation}% ${luminosity}% / ${opacity}%)`
          // // console.log(ctx.fillStyle)
          // // console.log(value)
          const y = height * (loudness - 1) * -1
          // console.log(loudness)
          ctx.beginPath()
          ctx.moveTo(x, y + height/2)
          ctx.lineTo(x + width, y + height/2)
          ctx.stroke()
          ctx.closePath()
        }
        // drawLoudness()
      
        function drawBrightness(){
          
          // console.log('spectralCentroid:', spectralCentroid)
          const y = 0
          const hue = spectralCentroid*360;//spectralCentroid * -1 * 360
          const saturation = spectralCentroid*50+50
          const luminosity = 50
          const opacity = loudness
          ctx.fillStyle = `hsla(${hue}deg ${saturation}% ${luminosity}% / ${opacity}%)`
          // // console.log(ctx.fillStyle)
          // // console.log(value)
          const x = width * (spectralCentroid - 1) * -1
          // console.log(spectralCentroid)
          ctx.fillRect(x + width/2, y, spectralCentroid ** 2 * 4, height)
        }
      
        function dark(){
          const saturation = spectralCentroid*100
          const luminosity = spectralCentroid*(y/height*normalisedSpectralCentroid)
        }
        */
        // drawBrightness()
      
        function drawLines() {
          //console.log('perceptualSharpness', perceptualSharpness, 'spectralCentroid', spectralCentroid)
      
          // console.log(normalisedSpectralCentroid, 'and', normalisedLoudness, 'res', (normalisedSpectralCentroid*normalisedLoudness - 1) * -1)
      
      
          let x = 0
          let y = height * (normalisedSpectralCentroid * normalisedLoudness - 1) + 0 + height / 2
      
      
          for (let i = 0; i <= 256; i++) {
            const lightness = perceptualSharpness
            ctx.beginPath()
            // ctx.moveTo(x, y)
      
            const wave = Math.sin(i / 256 * Math.PI * spectralCentroid * y / height) * rms * loudness.total * Math.sin(x / width * Math.PI) * lightness * (Math.cos(normalisedSpectralCentroid) * 8)
            y = height * (normalisedSpectralCentroid * normalisedLoudness - 1) + wave + height / 2
      
            const hue = y / height * 360 + Math.cos(Date.now()/21000)*360;// normalisedLoudness * -1 * 260 + perceptualSharpness* 260
            const saturation = 55 + lightness * 20;//spectralCentroid*200*lightness
            const luminosity = normalisedSpectralCentroid * 50;//spectralCentroid*(y/height*normalisedSpectralCentroid*lightness * 16)
            const opacity = normalisedLoudness * 100;//normalisedLoudness**2 * 4
            
            // ctx.shadowColor = spectralSkewness > 0 ? `rgba(255, 255, 255, .1)` : `rgba(0, 0, 0, .2)`;
            // ctx.shadowBlur = Math.sin(normalisedSpectralCentroid * Math.PI * 2) / 2 + .5;
            // ctx.shadowOffsetX = Math.sin(wave * Math.PI * 2) * wave;
            // ctx.shadowOffsetY = Math.sin(wave * Math.PI * 2) * wave;
      
            x = i / 256 * width
            // ctx.globalCompositeOperation = 'source-over'
            
            // ctx.lineTo(x, y + Math.cos(x / width * spectralSkewness * spectralCentroid) * spectralCentroid)
      for(let j = 0;j<3;j++){
        const n = j/3
        let lo =0
        if(!j%2) {
          ctx.globalCompositeOperation = 'screen'
          lo = 15
        }
          ctx.lineWidth = Math.sin(n*Math.PI)*4
          ctx.strokeStyle = `hsla(${hue-n*loudness.total}deg ${saturation}% ${luminosity+lo}% / ${opacity*0.8}%)`
          const yo = Math.cos(x / width * spectralSkewness * spectralCentroid/x * Math.PI*2) * spectralCentroid * Math.sin(x)*lo/25
          ctx.moveTo(y, x)
          ctx.lineTo(y+Math.sin(x/width*Math.PI*2)*spectralSkewness, x +yo)
          ctx.moveTo(width-y, x)
          ctx.lineTo(width-y, x +yo)
          ctx.stroke()
      }
            
            ctx.globalCompositeOperation = 'source-over'
            ctx.closePath()
          }
        }
      
        drawLines()
        ctx.restore()
        //console.log('spectralFlatness', spectralFlatness)
      
      
        // ctxB.fillStyle=`rgb(0,0,0,${(normalisedLoudness**2*.5)*0.9})`
        ctxB.clearRect(0, 0, width, height)
        const zoom = (normalisedZcr * spectralFlatness ** 2 * normalisedLoudness)
        const angle = normalisedZcr * Math.PI + spectralFlatness * Math.PI
        const xScale = Math.sin(angle) * 1 * zoom + Math.cos(angle) * 0.1 + 0.9
        const yScale = Math.cos(angle) * 1 * zoom + Math.sin(angle) * 0.1 + 0.9
        const xScaleUnit = (1 - xScale) * width
        const yScaleUnit = (1 - yScale) * height
        // const spx = Math.sin(spectralFlatness*Math.PI*2+Math.PI)+2+xScaleUnit*0.5+Math.sin(spectralFlatness*Math.PI*2)*loudness.total*0.5-loudness.total/4
        // const spy = Math.cos(spectralFlatness*Math.PI*2+Math.PI)+2+yScaleUnit*0.5+Math.cos(spectralFlatness*Math.PI*2)*-loudness.total*0.5+loudness.total/4
        let tx = Math.sin(performance.now() / 5000) * 2 + xScaleUnit * 0.5
        let ty = Math.cos(performance.now() / 5000) * 2 + yScaleUnit * 0.5
        tx += width / 2
        ty += height / 2
        ctxB.save()
        ctxB.translate(tx, ty)
      
        ctxB.scale(xScale, yScale)
        const rotate = true;//> 0.5
        if (rotate) ctxB.rotate(Math.sin(angle + Math.sin(angle) * Math.PI * 2)**(Math.cos(tx-ty)*2+1)* 0.04 * spectralFlatness)
        // draw canvas onto canvas b after translate + scale + rotation
        ctxB.drawImage(canvas, -tx, -ty)
        // undo rotation
        // if(rotate) ctxB.rotate(-Math.cos(-angle*Math.cos(angle)*Math.PI*2)*0.15*xScale*spectralFlatness)
        // ctxB.translate(-tx, -ty)
        ctxB.restore()
        // // flash refresh
        const flashRefresh = true
        if (!flashRefresh) ctx.fillRect(0, 0, width, height)
      
        // draw image back to canvas a
        ctx.drawImage(canvasB, 0, 0)
        //ctx.translate(canvas.width, canvas.width)
      
        ctx.fillStyle = `rgb(0,0,0,${(normalisedLoudness ** 2 * .5) * 0.06})`
        ctx.fillRect(0, 0, width, height)
      
        // frame++;
      }
      function onResize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      window.addEventListener('resize', onResize)
      
      return () => {
        window.removeEventListener('resize', onResize)
      }
    }
  }, [])
  
    if(data){
      return data
    }
      
     return {}
}
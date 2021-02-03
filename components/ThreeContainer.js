import { useState, useEffect } from 'react';
import { useCallbackRef } from 'use-callback-ref';
import * as THREE from 'three';
import useAnimationFrame from '../hooks/useAnimationFrame';
import useResize from '../hooks/useResize';

function initCanvas(el){
  const width = window.innerWidth;
  const height = window.innerHeight;
  const fov = 75;
  const near = 0.01;
  const far = 1000;
  const aspectRatio = width / height;

  const scene = new THREE.Scene();
  // TODO: make camera perspective optional
  const camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far );

  

  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const minWH = Math.min(width, height)
  renderer.setSize( minWH, minWH );
  renderer.autoClear = false;
  el.appendChild( renderer.domElement );
  return {
    scene,
    camera,
    renderer
  }
}

const ThreeContainer = ({ onInit, onAnimationFrame, onResize }) => {
  const [mountEl, setMountEl] = useState(null);
  const mountRef = useCallbackRef(null, el => {
    if(el){
      setMountEl(el);
    }
  })
  useEffect(()=>{
    if(mountEl){
      onInit(initCanvas(mountEl))
    }
  }, [mountEl])
  useAnimationFrame(true, onAnimationFrame);
  
  const { width, height } = useResize(true);
  const minWH = Math.min(width, height)
  useEffect(()=>{
    onResize(width, height, minWH);
  }, [width, height])
  return <div ref={mountRef}/>
}

export default ThreeContainer;
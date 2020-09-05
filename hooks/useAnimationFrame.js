import { useRef, useEffect } from 'react';

const useAnimationFrame = (playing, callback, deps = []) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  const animate = time => {
    if (previousTimeRef.current != undefined) {
      callback(deps)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  useEffect(() => {
    if(playing && typeof callback == 'function'){
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [playing, callback, ...deps]); // Make sure the effect runs only once
}

// function AnimationLoop({ onAnimationFrame, children }) {
//   useAnimationFrame(onAnimationFrame);
//   return children();
// }
export default useAnimationFrame;

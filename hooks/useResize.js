import { useState, useEffect } from 'react';
import { debounce } from 'debounce'
import iOS from '~/utils/isIOS'

const useResize = (listen = true, deps = [true]) => {
  let [dims, setDims] = useState({ width: 1400, height: 900 });
  const resize = () => {
    setDims({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  // mobile iOS resize fires before page layout finished, so you have to call it extra milliseconds later
 
  useEffect(() => {
    if(typeof window != 'undefined'){
      
      if (listen) {
        const debouncedResized = iOS() ? debounce(resize, 150) : debounce(resize, 15);
        if(deps.every(dep=>!!dep)) debouncedResized();
        window.addEventListener('resize', debouncedResized);
        return () => {
          window.removeEventListener('resize', debouncedResized);
        };
      }
    }
  }, [listen, ...deps]);
  return dims;
};
export default useResize;

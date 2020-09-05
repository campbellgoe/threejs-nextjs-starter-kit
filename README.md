# Three.js + Next.js starter kit

Integrate Three.js into your Next.js website with a simple 'ThreeContainer' component.

# Install

`git clone`

`cd threejs-nextjs-starter-kit`

`yarn`

# Run the project

`yarn dev` development mode

`yarn build && yarn start` production mode

# Notes

This starter kit comes with the following:

- ThreeContainer component for setting up the canvas
  - onInit callback for initializing your three.js code, such as setting up a scene, renderer, camera.
  - onAnimationFrame callback for animating/rendering your three.js scene
  - onResize callback to ensure the canvas is the correct size on change to the browser width/height

- styled-components
  - This is useful for styling UI components, but you can swap it out for something else if you prefer.

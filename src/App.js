import { OrbitControls } from "drei";
import React from "react";
import { Canvas } from "react-three-fiber";

import Scene from "./Scene";
// source https://codesandbox.io/s/r3f-torus-gag-forked-s7fg7?file=/src/App.js
export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40, near: 0.1, far: 1000 }}
      onCreated={(state) => {
        state.gl.localClippingEnabled = true;
      }}
    >
      <color attach="background" args={["black"]} />
      <Scene />
      <ambientLight />
      <pointLight color="white" position={[10, 20, 1]} />
      <OrbitControls />
    </Canvas>
  );
}

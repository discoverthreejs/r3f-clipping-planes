import * as THREE from "three";
import React, { useState, createRef } from "react";
import { useFrame } from "react-three-fiber";
import { Box, Plane } from "drei";

import { useControls } from "leva";

function PlaneStencilGroup({ geometry, plane, renderOrder }) {
  return (
    <group>
      <mesh geometry={geometry} renderOrder={renderOrder}>
        <meshBasicMaterial
          depthWrite={false}
          depthTest={false}
          colorWrite={false}
          stencilWrite={true}
          stencilFunc={THREE.AlwaysStencilFunc}
          side={THREE.FrontSide}
          clippingPlanes={[plane]}
          stencilFail={THREE.DecrementWrapStencilOp}
          stencilZFail={THREE.DecrementWrapStencilOp}
          stencilZPass={THREE.DecrementWrapStencilOp}
        />
      </mesh>
      <mesh geometry={geometry} renderOrder={renderOrder}>
        <meshBasicMaterial
          depthWrite={false}
          depthTest={false}
          colorWrite={false}
          stencilWrite={true}
          stencilFunc={THREE.AlwaysStencilFunc}
          side={THREE.BackSide}
          clippingPlanes={[plane]}
          stencilFail={THREE.IncrementWrapStencilOp}
          stencilZFail={THREE.IncrementWrapStencilOp}
          stencilZPass={THREE.IncrementWrapStencilOp}
        />
      </mesh>
    </group>
  );
}

export default function Scene() {
  const { xPlanePosition, yPlanePosition, zPlanePosition } = useControls({
    xPlanePosition: {
      value: 0.5,
      min: -1.5,
      max: 1.5,
      step: 0.1,
      onChange: (v) => (planes[0].constant = v),
    },
    yPlanePosition: {
      value: 0.0,
      min: -1.5,
      max: 1.5,
      step: 0.1,
      onChange: (v) => (planes[1].constant = v),
    },
    zPlanePosition: {
      value: 0.0,
      min: -1.5,
      max: 1.5,
      step: 0.1,
      onChange: (v) => (planes[2].constant = v),
    },
  });
  const [planes] = useState(() => [
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), xPlanePosition),
    // new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.5)
    new THREE.Plane(new THREE.Vector3(0, -1, 0), yPlanePosition),
    // new THREE.Plane(new THREE.Vector3(0, 1, 0), 1),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), zPlanePosition),
    // new THREE.Plane(new THREE.Vector3(0, 0, 1), 1)
  ]);
  const [planeObjects] = useState(() => [
    createRef(),
    createRef(),
    createRef(),
    // createRef(),
    // createRef(),
    // createRef(),
    // createRef()
  ]);

  useFrame(() => {
    planes.forEach((plane, i) => {
      const po = planeObjects[i].current;
      if (po) {
        plane.coplanarPoint(po.position);
        po.lookAt(
          po.position.x - plane.normal.x,
          po.position.y - plane.normal.y,
          po.position.z - plane.normal.z
        );
      }
    });
  });
  const boxArgs = [2, 1, 1];
  const box2Args = [1, 1, 2];

  return (
    <group>
      <group>
        <Box args={boxArgs}>
          <meshLambertMaterial
            color={"green"}
            metalness={0.1}
            roughness={0.75}
            clippingPlanes={planes}
            side={THREE.DoubleSide}
          />
        </Box>
        {planes.map((plane, i) => (
          <PlaneStencilGroup
            geometry={new THREE.BoxBufferGeometry(...boxArgs)}
            plane={plane}
            renderOrder={i + 1}
          />
        ))}
        <Box args={box2Args}>
          <meshLambertMaterial
            color={"green"}
            metalness={0.1}
            roughness={0.75}
            clippingPlanes={planes}
            side={THREE.DoubleSide}
          />
        </Box>
        {planes.map((plane, i) => (
          <PlaneStencilGroup
            geometry={new THREE.BoxBufferGeometry(...box2Args)}
            plane={plane}
            renderOrder={i + 1}
          />
        ))}
      </group>
      {planes.map((p, i) => (
        <planeHelper key={`0${i}`} args={[p, 2, 0xffffff]} />
      ))}
      {planeObjects.map((planeRef, index) => (
        <Plane
          key={`0${index}`}
          ref={planeRef}
          args={[4, 4]}
          renderOrder={index + 1.1}
          onAfterRender={(gl) => gl.clearStencil()}
        >
          <meshStandardMaterial
            color={["blue", "magenta", "yellow"][index]}
            metalness={0.1}
            roughness={0.75}
            clippingPlanes={planes.filter((_, i) => i !== index)}
            stencilWrite={true}
            stencilRef={0}
            side={THREE.DoubleSide}
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilFail={THREE.ReplaceStencilOp}
            stencilZFail={THREE.ReplaceStencilOp}
            stencilZPass={THREE.ReplaceStencilOp}
          />
        </Plane>
      ))}
    </group>
  );
}

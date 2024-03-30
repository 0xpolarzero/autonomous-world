import { useEffect, useRef, useState } from 'react';
import { Mesh, Plane, Raycaster, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export const DraggingControls = ({
  selected,
  placeholderPosition,
  setPlaceholderPosition,
  bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 },
}: {
  selected: number | undefined;
  placeholderPosition: Vector3;
  setPlaceholderPosition: (position: Vector3) => void;
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number };
}) => {
  // State
  const placeholderRef = useRef<Mesh>(null);

  const { camera } = useThree();

  // Raycast reference
  const planeNormal = new Vector3(0, 1, 0);
  const planePoint = new Vector3(0, 0, 0);
  const raycaster = new Raycaster();

  useFrame(({ pointer }) => {
    if (selected !== undefined) {
      // Calculate the mouse position in normalized device coordinates (-1 to +1) for both components.
      raycaster.setFromCamera(pointer, camera);
      const intersectPlane = new Plane(planeNormal, planePoint.dot(planeNormal) * -1);
      const intersection = raycaster.ray.intersectPlane(intersectPlane, new Vector3());

      if (intersection) {
        const x = Math.round(intersection.x);
        const z = Math.round(intersection.z);

        const xBounded = intersection.x < bounds?.minX ? bounds.minX : intersection.x > bounds?.maxX ? bounds.maxX : x;
        const zBounded = intersection.z < bounds?.minZ ? bounds.minZ : intersection.z > bounds?.maxZ ? bounds.maxZ : z;
        setPlaceholderPosition(new Vector3(Math.round(xBounded), placeholderPosition.y, Math.round(zBounded)));
      }
    }
  });

  if (selected !== undefined)
    return (
      <mesh ref={placeholderRef} position={placeholderPosition}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="hotpink" transparent opacity={0.5} />
      </mesh>
    );

  return null;
};

import { useRef } from 'react';
import { Mesh } from 'three';
import { Color, MeshProps, useFrame } from '@react-three/fiber';

interface CubeProps extends MeshProps {
  color?: Color;
}

export const Player = ({ color = 'red', ...props }: CubeProps) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    // Example: rotate the mesh every frame
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} position-x={2} castShadow {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

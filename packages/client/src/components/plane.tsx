import { ThreeElements } from '@react-three/fiber';

export const Plane = (props: ThreeElements['mesh']) => {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} scale={[10, 10, 10]} {...props}>
      <planeGeometry args={[10, 5, 10]} />
      <meshStandardMaterial color="greenyellow" />
    </mesh>
  );
};

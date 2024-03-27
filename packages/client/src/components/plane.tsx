import { ThreeElements } from '@react-three/fiber';

export const Plane = (props: ThreeElements['mesh']) => {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} {...props}>
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

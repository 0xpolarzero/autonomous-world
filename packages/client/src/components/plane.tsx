import { MeshProps } from '@react-three/fiber';

interface PlaneProps extends MeshProps {
  transparent?: boolean;
}

export const Plane = ({ transparent = false, ...props }: PlaneProps) => {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} {...props}>
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" transparent={transparent} opacity={transparent ? 0 : 1} />
    </mesh>
  );
};

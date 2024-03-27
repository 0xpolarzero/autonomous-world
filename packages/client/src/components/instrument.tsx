import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';
import { Color, MeshProps, ThreeEvent, useFrame } from '@react-three/fiber';
import { animated, config, useSpring } from '@react-spring/three';

interface CubeProps extends MeshProps {
  name: string;
  isSelected: boolean;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}

export const Instrument = ({ name, isSelected, onClick, ...props }: CubeProps) => {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);

  const { scale } = useSpring({ scale: hovered ? 1.3 : 1, config: config.wobbly });
  const color = isSelected ? 'hotpink' : 'lightblue';

  return (
    <>
      <animated.mesh
        ref={ref}
        castShadow
        onPointerEnter={() => hover(true)}
        onPointerLeave={() => hover(false)}
        onClick={onClick}
        scale={scale}
        {...props}
      >
        <Text color={color} position-y={2}>
          {name}
        </Text>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={color} />
      </animated.mesh>
    </>
  );
};

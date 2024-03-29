import { useRef, useState } from 'react';
import { Color, Mesh } from 'three';
import { Text } from '@react-three/drei';
import { MeshProps, ThreeEvent, useFrame } from '@react-three/fiber';
import { animated, config, useSpring } from '@react-spring/three';
import { Hex } from 'viem';

interface CubeProps extends MeshProps {
  name: string;
  color: Hex;
  active: boolean;
  isSelected: boolean;
}

export const Instrument = ({ name, color, active, isSelected, onClick, ...props }: CubeProps) => {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);
  const renderedColor = isSelected ? 'hotpink' : Number(color);

  const { scale } = useSpring({ scale: hovered ? 1.3 : 1, config: config.wobbly });

  return (
    <>
      <animated.mesh
        ref={ref}
        castShadow
        onPointerEnter={() => hover(true)}
        onPointerLeave={() => hover(false)}
        scale={scale}
        {...props}
      >
        {active ? (
          <Text color={renderedColor} position-y={2}>
            {name}
          </Text>
        ) : null}
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={renderedColor} transparent opacity={active ? 1 : 0.3} />
      </animated.mesh>
    </>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Mesh, PositionalAudio as PositionalAudioType } from 'three';
import { PositionalAudio, Text } from '@react-three/drei';
import { MeshProps, ThreeEvent, useFrame } from '@react-three/fiber';
import { animated, config, useSpring } from '@react-spring/three';
import { Hex } from 'viem';

import { instrumentNames, InstrumentType } from '@/lib/mud/types';

interface CubeProps extends MeshProps {
  instrumentType: InstrumentType;
  name: string;
  color: Hex;
  active: boolean;
  isSelected: boolean;
  audioInitialized: boolean;
  count: number;
}

export const Instrument = ({
  instrumentType,
  name,
  color,
  active,
  isSelected,
  audioInitialized,
  count,
  ...props
}: CubeProps) => {
  const ref = useRef<Mesh>(null);
  const audioRef = useRef<PositionalAudioType>(null);
  const [hovered, hover] = useState(false);
  const renderedColor = isSelected ? 'hotpink' : Number(color);

  const { scale } = useSpring({ scale: hovered ? 1.3 : 1, config: config.wobbly });

  useEffect(() => {
    if (active) {
      audioRef.current?.setVolume(1);
    } else {
      audioRef.current?.setVolume(0);
    }
  }, [active]);

  useEffect(() => {
    // Restart audio whenever an instrument is added
    audioRef.current?.stop();
    audioRef.current?.play();
  }, [count]);

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
            {name} - {instrumentNames[instrumentType]}
          </Text>
        ) : null}
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={renderedColor} transparent opacity={active ? 1 : 0.3} />
        {audioInitialized ? <PositionalAudio ref={audioRef} autoplay url="/audio/example.ogg" /> : null}
      </animated.mesh>
    </>
  );
};

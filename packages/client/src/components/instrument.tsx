import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { PositionalAudio, Text } from '@react-three/drei';
import { MeshProps, ThreeEvent, useFrame } from '@react-three/fiber';
import { useAudio } from '@/store/use-audio';
import { animated, config, useSpring } from '@react-spring/three';
import { Hex } from 'viem';
import Wad from 'web-audio-daw';

import { instrumentNames, InstrumentType, notes } from '@/lib/mud/types';

interface CubeProps extends MeshProps {
  index: number;
  instrumentType: InstrumentType;
  name: string;
  color: Hex;
  active: boolean;
  isSelected: boolean;
  count: number;
}

export const Instrument = ({ index, instrumentType, name, color, active, isSelected, count, ...props }: CubeProps) => {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);
  const renderedColor = isSelected ? 'hotpink' : Number(color);

  const { scale } = useSpring({ scale: hovered ? 1.3 : 1, config: config.wobbly });

  const { audioRefs, initialized, currentTick, partitions, createAudioRefs, updateAudioPosition } = useAudio(
    (state) => ({
      audioRefs: state.audioRefs,
      initialized: state.initialized,
      currentTick: state.currentTick,
      partitions: state.partitions,
      createAudioRefs: state.createAudioRefs,
      updateAudioPosition: state.updateAudioPosition,
    }),
  );

  // Create audio objects on initialization
  useEffect(() => {
    if (initialized) {
      createAudioRefs(index, instrumentType, props.position as Vector3);
    }
  }, [initialized]);

  // Update the position whenever the entity moves
  useEffect(() => {
    if (initialized && audioRefs) {
      const position = ref.current?.position ?? { x: 0, y: 0, z: 0 };
      updateAudioPosition(index, new Vector3(position.x, position.y, position.z));
    }
  }, [initialized, props.position]);

  // At each tick, play a note it if it's present in the partition array at the current tick
  useEffect(() => {
    if (initialized && active && partitions[index]) {
      const notes = partitions[index][currentTick];
      if (notes) {
        audioRefs[index].forEach((audioRef) => {
          if (notes.includes(audioRef.note)) {
            audioRef.audio.play();
          }
        });
      }
    }
  }, [currentTick, initialized, active]);

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
        {/* {initialized ? <PositionalAudio ref={audioRef} autoplay url="/audio/example.ogg" /> : null} */}
        {/* {initialized
          ? notes.map((note, idx) => (
              <PositionalAudio
                key={idx}
                ref={(audio) => {

                }}
                url={`/audio/${instrumentNames[instrumentType].toLowerCase()}/${note[0]}.mp3`}
              />
            ))
          : null} */}
      </animated.mesh>
    </>
  );
};

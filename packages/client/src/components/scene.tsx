import { useCallback, useEffect, useRef, useState } from 'react';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { getComponentValueStrict, Has } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { OrbitControls, useKeyboardControls } from '@react-three/drei';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { Controls, map, onKeyDown } from '@/lib/config/KeyboardControls';
import { useMUD } from '@/lib/config/MUDContext';
import { Instrument } from '@/components/instrument';
import { Plane } from '@/components/plane';
import { Sphere } from '@/components/sphere';

export const Scene = () => {
  // Movement (state)
  const [selectedInstr, setSelectedInstr] = useState<number | undefined>(undefined);
  const [sub, get] = useKeyboardControls<Controls>();

  // MUD (hooks)
  const {
    components: { Bounds, Count, Metadata, Position },
    systemCalls: { addInstrument, moveInstrumentBy },
  } = useMUD();

  // Controls
  const { performance } = useControls('Monitoring', {
    performance: false,
  });
  useControls('Instruments', {
    name: 'test',
    add: button((get) => {
      addInstrument(get('Instruments.name'), 0, 0, 0);
    }),
  });

  // MUD (parsing)
  const bounds = useComponentValue(Bounds, singletonEntity);
  const count = useComponentValue(Count, singletonEntity);
  const instruments = useEntityQuery([Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    const metadata = getComponentValueStrict(Metadata, entity);
    return {
      entity,
      position,
      metadata,
    };
  });

  // Keyboard controls
  useEffect(() => {
    return sub((state) => {
      Object.entries(state).forEach(([name, pressed]) => {
        if (pressed && selectedInstr !== undefined) {
          onKeyDown(name, (x, y, z) => {
            moveInstrumentBy(selectedInstr, x, y, z);
          });
        }
      });
    });
  }, [sub, selectedInstr]);

  return (
    <>
      {performance && <Perf position="top-left" />}
      <OrbitControls makeDefault />

      <group>
        <directionalLight position={[-2, 2, 3]} intensity={1.5} castShadow shadow-mapSize={[1024 * 2, 1024 * 2]} />
        <ambientLight intensity={0.2} />

        <Sphere />
        <Plane
          position={bounds ? [0, bounds.minY - 0.5, 0] : [0, -0.5, 0]}
          scale={
            bounds ? [bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ, bounds.maxY - bounds.minY] : [10, 10, 1]
          }
        />
        <gridHelper
          args={bounds ? [bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ] : [10, 10]}
          position-y={bounds ? bounds.minY - 0.4 : 0}
        />
        {instruments.map((instr, i) => (
          <Instrument
            key={i}
            name={instr.metadata.instrument}
            isSelected={selectedInstr === i}
            onClick={() => setSelectedInstr(selectedInstr === i ? undefined : i)}
            onPointerMissed={() => setSelectedInstr(undefined)}
            position={[instr.position.x, instr.position.y, instr.position.z]}
          />
        ))}
      </group>
    </>
  );
};

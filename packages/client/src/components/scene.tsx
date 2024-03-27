import { useEffect, useState } from 'react';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { getComponentValueStrict, Has } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { Vector3 } from 'three';
import { OrbitControls, useKeyboardControls } from '@react-three/drei';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { Controls, onKeyDown } from '@/lib/config/KeyboardControls';
import { useMUD } from '@/lib/config/MUDContext';
import { isOutOfBounds } from '@/lib/utils';
import { DraggingControls } from '@/components/dragging-controls';
import { Instrument } from '@/components/instrument';
import { Plane } from '@/components/plane';
import { Sphere } from '@/components/sphere';

export const Scene = () => {
  // Movement (state)
  const [selectedInstr, setSelectedInstr] = useState<number | undefined>(undefined);
  const [movingInstr, setMovingInstr] = useState<number | undefined>(undefined);
  const [placeholderPosition, setPlaceholderPosition] = useState(new Vector3());

  // MUD (hooks)
  const {
    components: { Bounds, Count, Metadata, Position },
    systemCalls: { addInstrument, moveInstrument, moveInstrumentBy },
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
  const [sub, get] = useKeyboardControls<Controls>();

  // MUD (parsing)
  const bounds = useComponentValue(Bounds, singletonEntity);
  const instruments = useEntityQuery([Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    const metadata = getComponentValueStrict(Metadata, entity);
    return {
      entity,
      position,
      metadata,
    };
  });

  // Keyboard controls (up/down/escape)
  useEffect(() => {
    return sub((state) => {
      Object.entries(state).forEach(([name, pressed]) => {
        if (pressed && selectedInstr !== undefined) {
          onKeyDown(name, (x, y, z) => {
            if (isOutOfBounds(placeholderPosition, x, y, z, bounds)) {
              return;
            }

            setPlaceholderPosition((prev) => new Vector3(prev.x + x, prev.y + y, prev.z + z));
          });
        }
      });
    });
  }, [sub, selectedInstr, placeholderPosition, bounds]);

  return (
    <>
      {performance && <Perf position="top-left" />}
      <OrbitControls enableRotate={!selectedInstr} minDistance={1} maxDistance={100} />
      <DraggingControls
        selected={selectedInstr}
        placeholderPosition={placeholderPosition}
        setPlaceholderPosition={setPlaceholderPosition}
        bounds={bounds ? { minX: bounds.minX, maxX: bounds.maxX, minZ: bounds.minZ, maxZ: bounds.maxZ } : undefined}
      />

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
        {/* just an invisible plane for drag&drop */}
        <Plane
          position={bounds ? [0, bounds.minY - 0.5, 0] : [0, -0.5, 0]}
          scale={[1000, 1000, 1]}
          transparent
          onPointerDown={async () => {
            if (selectedInstr !== undefined) {
              setSelectedInstr(undefined);

              // Update position
              setMovingInstr(selectedInstr);
              await moveInstrument(selectedInstr, placeholderPosition.x, placeholderPosition.y, placeholderPosition.z);
              setMovingInstr(undefined);
            }
          }}
        />
        {instruments.map((instr, i) => (
          <Instrument
            key={i}
            name={instr.metadata.instrument}
            isSelected={selectedInstr === i}
            isMoving={movingInstr === i}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelectedInstr(i);
              // Init placeholder position
              setPlaceholderPosition(new Vector3(instr.position.x, instr.position.y, instr.position.z));
            }}
            position={[instr.position.x, instr.position.y, instr.position.z]}
          />
        ))}
      </group>
    </>
  );
};

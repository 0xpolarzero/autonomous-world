import { useState } from 'react';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { getComponentValueStrict, Has } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { ACESFilmicToneMapping, SRGBColorSpace, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { Hex } from 'viem';

import { useMUD } from '@/lib/config/MUDContext';
import { StatusType } from '@/lib/mud/types';
import { Instrument } from '@/components/instrument';
import { Plane } from '@/components/plane';
import { Systems } from '@/components/systems';
import { UI } from '@/components/ui';

export const Scene = () => {
  // Movement (state)
  const [selectedInstr, setSelectedInstr] = useState<number | undefined>(undefined);
  const [placeholderPosition, setPlaceholderPosition] = useState(new Vector3());

  // MUD (hooks)
  const {
    components: { Bounds, Count, Instrument: InstrumentType, Metadata, Position, Status },
    systemCalls: { moveInstrument },
  } = useMUD();

  // MUD (parsing)
  const bounds = useComponentValue(Bounds, singletonEntity);
  const count = useComponentValue(Count, singletonEntity);
  const instruments = useEntityQuery([Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    const metadata = getComponentValueStrict(Metadata, entity);
    const instrumentType = getComponentValueStrict(InstrumentType, entity);
    const status = getComponentValueStrict(Status, entity);

    return {
      position: new Vector3(position.x, position.y, position.z),
      metadata,
      type: instrumentType.value,
      status: status.value,
    };
  });

  // Read statuses to listen for changes (or it won't re-render on status change)
  useEntityQuery([Has(Status)]);

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
        camera={{
          fov: 55,
          near: 0.1,
          far: 200,
          position: [0, 40, 50],
        }}
        shadows
      >
        <group>
          <directionalLight position={[-2, 2, 3]} intensity={1.5} castShadow shadow-mapSize={[1024 * 2, 1024 * 2]} />
          <ambientLight intensity={0.2} />

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
                await moveInstrument(
                  selectedInstr,
                  placeholderPosition.x,
                  placeholderPosition.y,
                  placeholderPosition.z,
                );
              }
            }}
          />
          {instruments.map((instr, i) => (
            <Instrument
              key={i}
              index={i}
              instrumentType={instr.type}
              name={instr.metadata.name}
              color={instr.metadata.color as Hex}
              active={instr.status === StatusType.Active}
              isSelected={selectedInstr === i}
              count={count?.value || 0}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelectedInstr(i);
                // Init placeholder position
                setPlaceholderPosition(new Vector3(instr.position.x, instr.position.y, instr.position.z));
              }}
              position={instr.position}
            />
          ))}
        </group>

        <Systems
          instruments={instruments}
          placeholderPosition={placeholderPosition}
          selectedInstr={selectedInstr}
          count={count?.value}
          bounds={bounds}
          setSelectedInstr={setSelectedInstr}
          setPlaceholderPosition={setPlaceholderPosition}
        />
      </Canvas>

      <UI selectedInstr={selectedInstr} />
    </>
  );
};

import { useEffect, useState } from 'react';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { getComponentValueStrict, Has } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { ACESFilmicToneMapping, SRGBColorSpace, Vector3 } from 'three';
import { OrbitControls, useKeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Hex } from 'viem';

import { Controls, onKeyDown } from '@/lib/config/KeyboardControls';
import { useMUD } from '@/lib/config/MUDContext';
import { isOutOfBounds } from '@/lib/utils';
import { DraggingControls } from '@/components/canvas/dragging-controls';
import { Instrument } from '@/components/canvas/instrument';
import { Plane } from '@/components/canvas/plane';

import { InterfaceControls } from '../ui/interface-controls';
import { InterfaceHints } from '../ui/interface-hints';

export const Scene = () => {
  // Movement (state)
  const [selectedInstr, setSelectedInstr] = useState<number | undefined>(undefined);
  const [pendingInstr, setPendingInstr] = useState<number | undefined>(undefined);
  const [placeholderPosition, setPlaceholderPosition] = useState(new Vector3());

  // MUD (hooks)
  const {
    components: { Bounds, Count, Metadata, Position },
    systemCalls: { moveInstrument },
  } = useMUD();

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

  const [sub, get] = useKeyboardControls<Controls>();

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

  // Helpers
  const wrapPending = async (instr: number, action: () => Promise<void>) => {
    setPendingInstr(instr);
    await action();
    setPendingInstr(undefined);
  };

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
        <InterfaceControls
          // @ts-ignore
          instruments={instruments}
          count={count?.value}
          setSelectedInstr={setSelectedInstr}
          setPlaceholderPosition={setPlaceholderPosition}
          wrapPending={wrapPending}
        />
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
                wrapPending(selectedInstr, async () => {
                  await moveInstrument(
                    selectedInstr,
                    placeholderPosition.x,
                    placeholderPosition.y,
                    placeholderPosition.z,
                  );
                });
              }
            }}
          />
          {instruments.map((instr, i) => (
            <Instrument
              key={i}
              name={instr.metadata.name}
              color={instr.metadata.color as Hex}
              hidden={instr.metadata.hidden}
              isSelected={selectedInstr === i}
              isPending={pendingInstr === i}
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
      </Canvas>
      <InterfaceHints selectedInstr={selectedInstr} pending={pendingInstr !== undefined} />
    </>
  );
};

import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { Vector3 } from 'three';
import { OrbitControls, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Wad from 'web-audio-daw';

import { Controls, onKeyDown } from '@/lib/config/KeyboardControls';
import { InstrumentEntity } from '@/lib/mud/types';
import { isOutOfBounds } from '@/lib/utils';
import { DraggingControls } from '@/components/systems/dragging-controls';
import { InterfaceControls } from '@/components/systems/interface-controls';

type SystemsProps = {
  instruments: InstrumentEntity[];
  placeholderPosition: Vector3;
  selectedInstr?: number;
  count?: number;
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number };
  setSelectedInstr: (index: number) => void;
  setPlaceholderPosition: Dispatch<SetStateAction<Vector3>>;
};

export const Systems: FC<SystemsProps> = ({
  instruments,
  placeholderPosition,
  selectedInstr,
  count,
  bounds,
  setSelectedInstr,
  setPlaceholderPosition,
}) => {
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

  useFrame(({ camera }) => {
    Wad.listener.setPosition(camera.position.x, camera.position.y, camera.position.z);
  });

  return (
    <>
      <InterfaceControls
        // @ts-ignore
        instruments={instruments}
        count={count}
        setSelectedInstr={setSelectedInstr}
        setPlaceholderPosition={setPlaceholderPosition}
      />
      <OrbitControls enableRotate={!selectedInstr} minDistance={1} maxDistance={100} />
      <DraggingControls
        selected={selectedInstr}
        placeholderPosition={placeholderPosition}
        setPlaceholderPosition={setPlaceholderPosition}
        bounds={bounds ? { minX: bounds.minX, maxX: bounds.maxX, minZ: bounds.minZ, maxZ: bounds.maxZ } : undefined}
      />
    </>
  );
};

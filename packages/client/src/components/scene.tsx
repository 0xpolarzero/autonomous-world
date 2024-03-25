import { useRef } from 'react';
import { useComponentValue, useEntityQuery } from '@latticexyz/react';
import { getComponentValueStrict, Has } from '@latticexyz/recs';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { useMUD } from '@/lib/config/MUDContext';
import { useKeyboardMovement } from '@/lib/hooks/useKeyboardMovement';
import { Plane } from '@/components/plane';
import { Player } from '@/components/player';
import { Sphere } from '@/components/sphere';

export const Scene = () => {
  // Controls
  useKeyboardMovement();
  const { performance } = useControls('Monitoring', {
    performance: false,
  });

  // Players
  const {
    components: { Position },
    network: { playerEntity },
  } = useMUD();

  const playerPosition = useComponentValue(Position, playerEntity);
  const players = useEntityQuery([Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    return {
      entity,
      position,
    };
  });

  useThree(({ camera }) => {
    if (playerPosition) {
      // camera.position.set(playerPosition.x - 5, playerPosition.y + 5, playerPosition.z + 5);
    } else {
      camera.position.set(-5, 5, 5);
    }
    camera.rotation.order = 'YXZ';
    camera.rotation.y = -Math.PI / 4;
    camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
  });

  return (
    <>
      {performance && <Perf position="top-left" />}
      <OrbitControls makeDefault />

      <group>
        <directionalLight position={[-2, 2, 3]} intensity={1.5} castShadow shadow-mapSize={[1024 * 2, 1024 * 2]} />
        <ambientLight intensity={0.2} />

        <Sphere />
        <Plane position={[0, -5, 0]} />
        {players.map((p, i) => (
          <Player
            key={i}
            color={Math.floor(parseInt(p.entity) * 123456) % 16777215}
            position={[p.position.x, p.position.y, p.position.z]}
          />
        ))}
      </group>
    </>
  );
};

import { KeyboardControlsEntry } from '@react-three/drei';

export enum Controls {
  up = 'up',
  down = 'down',
}

export const map: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.up, keys: ['ArrowUp', 'Space'] },
  { name: Controls.down, keys: ['ArrowDown', 'ControlLeft', 'ControlRight'] },
];

export const onKeyDown = (key: string, callback: (x: number, y: number, z: number) => void) => {
  switch (key) {
    case Controls.up:
      callback(0, 1, 0);
      break;
    case Controls.down:
      callback(0, -1, 0);
      break;
  }
};

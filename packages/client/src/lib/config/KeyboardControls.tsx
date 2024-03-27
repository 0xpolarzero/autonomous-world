import { KeyboardControlsEntry } from '@react-three/drei';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export const map: KeyboardControlsEntry<Controls>[] = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.up, keys: ['Space'] },
  { name: Controls.down, keys: ['ControlLeft', 'ControlRight'] },
];

export const onKeyDown = (key: string, callback: (x: number, y: number, z: number) => void) => {
  switch (key) {
    case Controls.forward:
      callback(1, 0, 0);
      break;
    case Controls.back:
      callback(-1, 0, 0);
      break;
    case Controls.left:
      callback(0, 0, -1);
      break;
    case Controls.right:
      callback(0, 0, 1);
      break;
    case Controls.up:
      callback(0, 1, 0);
      break;
    case Controls.down:
      callback(0, -1, 0);
      break;
  }
};

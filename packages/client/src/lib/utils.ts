import { Entity } from '@latticexyz/recs';
import { Address, encodeAbiParameters, keccak256 } from 'viem';

export const getInstrumentKey = (account: Address, index: number): Entity =>
  keccak256(
    encodeAbiParameters(
      [
        { name: 'account', type: 'address' },
        { name: 'index', type: 'uint32' },
      ],
      [account, index],
    ),
  ) as Entity;

export const isOutOfBounds = (position: any, dx: number, dy: number, dz: number, bounds?: any) =>
  !bounds ||
  position.x + dx < bounds.minX ||
  position.x + dx > bounds.maxX ||
  position.y + dy < bounds.minY ||
  position.y + dy > bounds.maxY ||
  position.z + dz < bounds.minZ ||
  position.z + dz > bounds.maxZ;

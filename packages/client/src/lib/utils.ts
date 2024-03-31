import { Entity } from '@latticexyz/recs';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Address, encodeAbiParameters, keccak256 } from 'viem';

// Merge Tailwind CSS classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

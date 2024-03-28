/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { Hex } from 'viem';

import { ClientComponents } from '@/lib/mud/createClientComponents';
import { SetupNetworkResult } from '@/lib/mud/setupNetwork';
import { getInstrumentKey, isOutOfBounds } from '@/lib/utils';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/threejs/packages/client/src/mud/setupNetwork.ts#L61-L67).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/threejs/packages/client/src/mud/setupNetwork.ts#L75-L81).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/threejs/packages/client/src/mud/setupNetwork.ts#L75-L81).
   */
  { worldContract, waitForTransaction, walletClient }: SetupNetworkResult,
  { Bounds, Position }: ClientComponents,
) {
  const addInstrument = async (name: string, color: Hex, x: number, y: number, z: number) => {
    const tx = await worldContract.write.add([name, color, x, y, z]);
    await waitForTransaction(tx);
  };

  const moveInstrument = async (index: number, x: number, y: number, z: number) => {
    const tx = await worldContract.write.move([index, x, y, z]);
    await waitForTransaction(tx);
  };

  const hideInstrument = async (index: number) => {
    const tx = await worldContract.write.hide([index]);
    await waitForTransaction(tx);
  };

  const showInstrument = async (index: number) => {
    const tx = await worldContract.write.show([index]);
    await waitForTransaction(tx);
  };

  // const moveInstrumentBy = async (index: number, dx: number, dy: number, dz: number) => {
  //   // Get position of instrument and move it
  //   const position = getComponentValue(Position, getInstrumentKey(walletClient.account.address, index));
  //   // Get bounds
  //   const bounds = getComponentValue(Bounds, singletonEntity);

  //   if (!position) {
  //     throw new Error(`Instrument ${index} not found`);
  //   }

  //   if (isOutOfBounds(position, dx, dy, dz, bounds)) {
  //     throw new Error('Out of bounds');
  //   }

  //   const x = position.x + dx;
  //   const y = position.y + dy;
  //   const z = position.z + dz;
  //   await moveInstrument(index, x, y, z);
  // };

  return {
    addInstrument,
    moveInstrument,
    hideInstrument,
    showInstrument,
  };
}

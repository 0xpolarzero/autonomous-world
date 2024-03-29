/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from '@latticexyz/recs';
import { singletonEntity } from '@latticexyz/store-sync/recs';
import { uuid } from '@latticexyz/utils';
import { Hex } from 'viem';

import { ClientComponents } from '@/lib/mud/createClientComponents';
import { SetupNetworkResult } from '@/lib/mud/setupNetwork';
import { StatusType } from '@/lib/mud/types';
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
  { Count, Metadata, Position, Status }: ClientComponents,
) {
  const getEntityId = (index: number) => getInstrumentKey(walletClient.account.address, index);

  const addInstrument = async (index: number, name: string, color: Hex, x: number, y: number, z: number) => {
    // Overrides
    const countId = uuid();
    const positionId = uuid();
    const metadataId = uuid();
    const statusId = uuid();

    Count.addOverride(countId, {
      entity: singletonEntity,
      value: { value: index + 1 },
    });
    Position.addOverride(positionId, {
      entity: getEntityId(index),
      value: { x, y, z },
    });
    Metadata.addOverride(metadataId, {
      entity: getEntityId(index),
      value: { name, color },
    });
    Status.addOverride(statusId, {
      entity: getEntityId(index),
      value: { value: StatusType.Active },
    });

    // Tx
    try {
      const tx = await worldContract.write.add([name, color, x, y, z]);
      await waitForTransaction(tx);
    } finally {
      // Clean up
      Count.removeOverride(countId);
      Position.removeOverride(positionId);
      Metadata.removeOverride(metadataId);
      Status.removeOverride(statusId);
    }
  };

  const moveInstrument = async (index: number, x: number, y: number, z: number) => {
    // Overrides
    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: getEntityId(index),
      value: { x, y, z },
    });

    // Tx
    try {
      const tx = await worldContract.write.move([index, x, y, z]);
      await waitForTransaction(tx);
    } finally {
      // Clean up
      Position.removeOverride(positionId);
    }
  };

  const setInstrumentStatus = async (index: number, status: StatusType) => {
    // Overrides
    const statusId = uuid();
    Status.addOverride(statusId, {
      entity: getEntityId(index),
      value: { value: status },
    });

    // Tx
    try {
      const tx = await worldContract.write.setStatus([index, status]);
      await waitForTransaction(tx);
    } finally {
      // Clean up
      Status.removeOverride(statusId);
    }
  };

  return {
    addInstrument,
    moveInstrument,
    setInstrumentStatus,
  };
}

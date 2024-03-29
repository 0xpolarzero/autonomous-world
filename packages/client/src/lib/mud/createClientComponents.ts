/*
 * Creates components for use by the client.
 *
 * By default it returns the components from setupNetwork.ts, those which are
 * automatically inferred from the mud.config.ts table definitions.
 *
 * However, you can add or override components here as needed. This
 * lets you add user defined components, which may or may not have
 * an onchain component.
 */

import { overridableComponent } from '@latticexyz/recs';

import { SetupNetworkResult } from '@/lib/mud/setupNetwork';

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components }: SetupNetworkResult) {
  return {
    ...components,
    Count: overridableComponent(components.Count),
    Position: overridableComponent(components.Position),
    Metadata: overridableComponent(components.Metadata),
    Status: overridableComponent(components.Status),
  };
}

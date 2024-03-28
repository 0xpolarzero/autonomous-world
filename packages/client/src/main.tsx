import React from 'react';
import { KeyboardControls } from '@react-three/drei';
import { Leva } from 'leva';
import ReactDOM from 'react-dom/client';

import { Scene } from '@/components/canvas/scene';

import '@/styles/globals.css';

import mudConfig from 'contracts/mud.config';

import { map } from '@/lib/config/KeyboardControls';
import { MUDProvider } from '@/lib/config/MUDContext';
import { setup } from '@/lib/mud/setup';

setup().then(async (result) => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MUDProvider value={result}>
        <KeyboardControls map={map}>
          <div className="main">
            <Leva
              collapsed={false}
              oneLineLabels={false}
              flat={true}
              theme={{
                sizes: {
                  titleBarHeight: '28px',
                },
                fontSizes: {
                  root: '10px',
                },
              }}
            />
            <Scene />
          </div>
        </KeyboardControls>
      </MUDProvider>
    </React.StrictMode>,
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import('@latticexyz/dev-tools');
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});

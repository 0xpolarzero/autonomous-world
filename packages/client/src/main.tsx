import React from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import ReactDOM from 'react-dom/client';

import { Scene } from '@/components/scene';

import '@/styles/globals.css';

import mudConfig from 'contracts/mud.config';

import { MUDProvider } from '@/lib/config/MUDContext';
import { setup } from '@/lib/mud/setup';

setup().then(async (result) => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MUDProvider value={result}>
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
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              toneMapping: ACESFilmicToneMapping,
              outputColorSpace: SRGBColorSpace,
            }}
            camera={{
              fov: 55,
              near: 0.1,
              far: 200,
              position: [3, 2, 9],
            }}
            shadows
          >
            <Scene />
          </Canvas>
        </div>
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

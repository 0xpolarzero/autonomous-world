import { FC, useState } from 'react';
import { useAudio } from '@/store/use-audio';

import { InstrumentEntity } from '@/lib/mud/types';
import { DAW } from '@/components/ui/daw';
import { InterfaceHints } from '@/components/ui/interface-hints';

type UIProps = {
  instruments: InstrumentEntity[];
  selectedInstr?: number;
};

export const UI: FC<UIProps> = ({ instruments, selectedInstr }) => {
  const [showDaw, setShowDaw] = useState(false);

  // Audio
  const { initialized, initAudio } = useAudio((state) => ({
    initialized: state.initialized,
    initAudio: state.initAudio,
  }));

  return (
    <>
      <InterfaceHints selectedInstr={selectedInstr} />
      {initialized && instruments.length > 0 ? (
        <>
          <div
            onClick={() => setShowDaw(!showDaw)}
            className="bg-overlay absolute left-4 top-4 cursor-pointer px-2 py-1 font-mono text-sm"
          >
            {showDaw ? '' : '> Show DAW'}
          </div>
          {showDaw ? <DAW instruments={instruments} close={() => setShowDaw(false)} /> : null}
        </>
      ) : (
        <div
          onClick={initAudio}
          className="bg-overlay absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center font-mono text-sm"
        >
          Click to start
        </div>
      )}
    </>
  );
};

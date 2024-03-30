import { FC } from 'react';
import { useAudio } from '@/store/use-audio';

import { InterfaceHints } from './interface-hints';

type UIProps = {
  selectedInstr?: number;
};

export const UI: FC<UIProps> = ({ selectedInstr }) => {
  // Audio
  const { initialized, initAudio } = useAudio((state) => ({
    initialized: state.initialized,
    initAudio: state.initAudio,
  }));

  return (
    <>
      <InterfaceHints selectedInstr={selectedInstr} />
      {initialized ? null : (
        <div
          onClick={initAudio}
          className="interface"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
            }}
          >
            Click to start
          </div>
        </div>
      )}
    </>
  );
};

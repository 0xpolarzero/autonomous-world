import { FC } from 'react';

type InterfaceHintsProps = {
  selectedInstr: number | undefined;
};

export const InterfaceHints: FC<InterfaceHintsProps> = ({ selectedInstr }) => {
  return (
    <div className="bg-overlay absolute bottom-4 left-4 cursor-pointer px-2 py-1 font-mono text-sm">
      {selectedInstr !== undefined
        ? 'Use the up and down arrows to change elevation'
        : 'Click on an instrument to move it'}
    </div>
  );
};

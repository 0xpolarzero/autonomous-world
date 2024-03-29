import { FC } from 'react';

type InterfaceHintsProps = {
  selectedInstr: number | undefined;
};

export const InterfaceHints: FC<InterfaceHintsProps> = ({ selectedInstr }) => {
  return (
    <div className="interface hints">
      <div className="list">
        {selectedInstr !== undefined
          ? 'Use the up and down arrows to change elevation'
          : 'Click on an instrument to move it'}
      </div>
    </div>
  );
};

import { FC } from 'react';

type InterfaceHintsProps = {
  selectedInstr: number | undefined;
  pending: boolean;
};

export const InterfaceHints: FC<InterfaceHintsProps> = ({ selectedInstr, pending }) => {
  return (
    <div className="interface hints">
      <div className="list">
        {selectedInstr !== undefined
          ? 'Use the up and down arrows to change elevation'
          : pending
            ? 'Updating an instrument...'
            : 'Click on an instrument to move it'}
      </div>
    </div>
  );
};

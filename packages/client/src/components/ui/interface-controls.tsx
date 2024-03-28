import { FC, useMemo } from 'react';
import { Entity } from '@latticexyz/recs';
import { Color, Vector3 } from 'three';
import { button, folder, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { useMUD } from '@/lib/config/MUDContext';

type InterfaceControlsProps = {
  instruments: Entity & { metadata: { name: string }; position: Vector3 }[];
  count?: number;
  setSelectedInstr: (index: number) => void;
  setPlaceholderPosition: (position: Vector3) => void;
  wrapPending: (instr: number, action: () => Promise<void>) => void;
};

export const InterfaceControls: FC<InterfaceControlsProps> = ({
  instruments,
  count,
  setSelectedInstr,
  setPlaceholderPosition,
  wrapPending,
}) => {
  // MUD (hooks)
  const {
    systemCalls: { addInstrument, hideInstrument, showInstrument },
  } = useMUD();

  const instrumentsControls = useMemo(() => {
    return instruments.reduce((acc, instr, i) => {
      const instrumentName = instr.metadata.name;
      // @ts-ignore
      acc[`Instruments.${instrumentName}`] = folder(
        {
          [`move ${i}`]: button(() => {
            setSelectedInstr(i);
            setPlaceholderPosition(new Vector3(instr.position.x, instr.position.y, instr.position.z));
          }),
          [`hide ${i}`]: button(() => wrapPending(i, () => hideInstrument(i))),
          [`show ${i}`]: button(() => wrapPending(i, () => showInstrument(i))),
        },
        { collapsed: true },
      );
      return acc;
    }, {});
  }, [instruments, setSelectedInstr, setPlaceholderPosition]);

  const { performance } = useControls('Monitoring', {
    performance: false,
  });

  useControls('Instruments.New', {
    name: 'instrument name',
    color: '#ff0000',
    'add instrument': button((get) => {
      addInstrument(
        `${get('Instruments.New.name')} (${((count || 0) + 1).toString()})`,
        `0x${new Color(get('Instruments.New.color')).getHexString()}`,
        0,
        0,
        0,
      );
    }),
  });

  useControls(instrumentsControls);

  return performance ? <Perf position="top-left" /> : null;
};

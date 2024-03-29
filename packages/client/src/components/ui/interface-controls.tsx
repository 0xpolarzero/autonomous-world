import { FC, useMemo } from 'react';
import { Entity } from '@latticexyz/recs';
import { Color, Vector3 } from 'three';
import { button, folder, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import { useMUD } from '@/lib/config/MUDContext';
import { StatusType } from '@/lib/mud/types';

type InterfaceControlsProps = {
  instruments: Entity & { metadata: { name: string }; position: Vector3 }[];
  count?: number;
  setSelectedInstr: (index: number) => void;
  setPlaceholderPosition: (position: Vector3) => void;
};

export const InterfaceControls: FC<InterfaceControlsProps> = ({
  instruments,
  count,
  setSelectedInstr,
  setPlaceholderPosition,
}) => {
  // MUD (hooks)
  const {
    systemCalls: { addInstrument, setInstrumentStatus },
  } = useMUD();

  const instrumentsControls = useMemo(() => {
    return instruments.reduce((acc, instr, i) => {
      const instrumentName = instr.metadata.name;
      // @ts-ignore
      acc[`Instruments.${instrumentName}`] = folder(
        {
          [`move ${i + 1}`]: button(() => {
            setSelectedInstr(i);
            setPlaceholderPosition(new Vector3(instr.position.x, instr.position.y, instr.position.z));
          }),
          [`hide ${i + 1}`]: button(() => setInstrumentStatus(i, StatusType.Inactive)),
          [`show ${i + 1}`]: button(() => setInstrumentStatus(i, StatusType.Active)),
        },
        { collapsed: true },
      );
      return acc;
    }, {});
  }, [instruments, setSelectedInstr, setPlaceholderPosition]);

  const { performance } = useControls('Monitoring', {
    performance: false,
  });

  useControls(
    'Instruments.New',
    {
      name: 'instrument name',
      color: '#ff0000',
      'add instrument': button((get) => {
        addInstrument(
          count || 0,
          `${get('Instruments.New.name')} (${((count || 0) + 1).toString()})`,
          `0x${new Color(get('Instruments.New.color')).getHexString()}`,
          0,
          0,
          0,
        );
      }),
    },
    [count],
  );

  useControls(instrumentsControls, [instruments]);

  return performance ? <Perf position="top-left" /> : null;
};

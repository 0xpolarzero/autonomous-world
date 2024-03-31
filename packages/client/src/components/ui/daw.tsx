import { FC, Fragment, useState } from 'react';
import { useAudio } from '@/store/use-audio';

import { beats, InstrumentEntity, notes, precision } from '@/lib/mud/types';
import { cn } from '@/lib/utils';

type DAWProps = {
  instruments: InstrumentEntity[];
  close: () => void;
};

export const DAW: FC<DAWProps> = ({ instruments, close }) => {
  const [selected, setSelected] = useState<number>(0);
  const { currentTick, partitions, toggleNote } = useAudio((state) => ({
    currentTick: state.currentTick,
    partitions: state.partitions,
    toggleNote: state.toggleNote,
  }));

  return (
    <div
      className="bg-overlay absolute left-0 top-0 flex h-full w-full flex-col gap-2 p-4 font-mono text-sm"
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between gap-4">
        <button
          className="w-min cursor-pointer rounded-sm bg-gray-700 px-2 py-[2px] transition-colors hover:bg-gray-600"
          onClick={close}
        >
          x
        </button>
        <select
          onChange={(e) => setSelected(Number(e.target.value))}
          className="cursor-pointer rounded-sm bg-gray-700 px-2 py-1 transition-colors hover:bg-gray-600"
        >
          {instruments.map((instr, i) => (
            <option key={i} value={i}>
              {instr.metadata.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 grid h-full grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] gap-2">
        <div className="flex h-full flex-col gap-1">
          {notes.map((note, i) => (
            <div key={i} className="flex h-4 items-center">
              {note}
            </div>
          ))}
        </div>
        <div className="flex h-full flex-col gap-1 overflow-scroll">
          {notes.map((note, i) => (
            <div key={i} className="flex justify-between gap-1">
              {Array.from({ length: beats }).map((_, j) => (
                <Fragment key={j}>
                  <div className={cn('flex h-4 w-16', j % 4 === 3 && 'mr-1')}>
                    {Array.from({ length: precision }).map((_, k) => {
                      // if (selected && partitions[selected]) {
                      //   console.log('selected', partitions[selected] && partitions[selected][j * precision + k], note);
                      // }
                      return (
                        <button
                          key={j * precision + k}
                          className={cn(
                            'h-full w-4 border-r border-gray-900 last-of-type:border-none',
                            partitions[selected] && partitions[selected][j * precision + k].includes(note)
                              ? 'bg-gray-700'
                              : currentTick === j * precision + k
                                ? 'bg-gray-500'
                                : 'bg-gray-400',
                          )}
                          onClick={() => toggleNote(selected, j * precision + k, note)}
                        />
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

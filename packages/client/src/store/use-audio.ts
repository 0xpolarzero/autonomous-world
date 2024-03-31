import { Vector3 } from 'three';
import Wad from 'web-audio-daw';
import { create } from 'zustand';

import { AudioRef, beats, instrumentFolders, InstrumentType, notes, precision } from '@/lib/mud/types';

type AudioStore = {
  audioRefs: Record<number, AudioRef[]>; // index of the instrument -> audio refs
  initialized: boolean;
  currentTick: number;

  partitions: Record<number, (typeof notes)[]>; // index of the instrument -> notes

  initAudio: () => void;
  createAudioRefs: (index: number, instrument: InstrumentType, position: Vector3) => void;
  updateAudioPosition: (index: number, position: Vector3) => void;

  toggleNote: (instrumentIndex: number, partitionIndex: number, note: (typeof notes)[number]) => void;
};

const bpm = 120;

export const useAudio = create<AudioStore>((set, get) => ({
  audioRefs: {},
  partitions: {},
  initialized: false,
  currentTick: 0,

  // Init the tick interval and let the system know that the user has interacted (audio context can be created)
  initAudio: () => {
    const { initialized } = get();
    if (initialized) return;

    const interval = setInterval(
      () => {
        set((state) => ({ currentTick: (state.currentTick + 1) % (beats * precision) }));
      },
      (60 / bpm / precision) * 1000,
    );

    set({ initialized: true });

    return () => clearInterval(interval);
  },

  createAudioRefs: (index, instrument, position) => {
    let { audioRefs, partitions } = get();
    if (!audioRefs[index]) audioRefs[index] = [];

    notes.forEach((note) => {
      const audio = new Wad({
        // @ts-ignore
        source: `/audio/${instrumentFolders[instrument]}/${note}.mp3`,
        panning: [position.x, position.y, position.z] ?? [0, 0, 0],
        panningModel: 'HRTF',
      });

      audioRefs[index].push({ note, audio });
    });

    // Init partition as well
    if (!partitions[index])
      set((state) => ({
        partitions: { ...state.partitions, [index]: Array.from({ length: beats * precision }, () => []) },
      }));

    set({ audioRefs });
  },

  updateAudioPosition: (index, position) => {
    const { audioRefs } = get();
    if (!audioRefs[index]) return;

    audioRefs[index].forEach((ref) => {
      ref.audio.panning.location = [position.x, position.y, position.z];
    });

    set({ audioRefs });
  },

  toggleNote: (instrumentIndex, partitionIndex, note) => {
    let { partitions } = get();

    let partition = partitions[instrumentIndex];
    if (partition[partitionIndex].includes(note)) {
      partition[partitionIndex] = partition[partitionIndex].filter((n) => n !== note);
    } else {
      partition[partitionIndex].push(note);
    }

    set({ partitions });
  },
}));

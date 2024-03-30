import { Vector3 } from 'three';
import Wad from 'web-audio-daw';
import { create } from 'zustand';

import { instrumentFolders, InstrumentType, notes } from '@/lib/mud/types';

type AudioStore = {
  audioRefs: Record<number, any[]>; // index of the instrument -> audio refs
  initialized: boolean;
  currentTick: number;

  initAudio: () => void;
  createAudioRefs: (index: number, instrument: InstrumentType, position: Vector3) => void;

  updateAudioPosition: (index: number, position: Vector3) => void;
};

const beats = 16;
const bpm = 120;
const precision = 4; // 1/4th notes

export const useAudio = create<AudioStore>((set, get) => ({
  audioRefs: {},
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
    let { audioRefs } = get();
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
}));

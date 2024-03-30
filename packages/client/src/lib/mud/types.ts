import { Entity } from '@latticexyz/recs';
import { Vector3 } from 'three';

/* ------------------------------- INSTRUMENTS ------------------------------ */
export type InstrumentEntity = {
  position: Vector3;
  metadata: { name: string; color: string };
  type: InstrumentType;
  status: StatusType;
};

export enum InstrumentType {
  Voice = 0,
  Harp = 1,
  HangDrum = 2,
  Glockenspiel = 3,
}

export const instrumentOptions: Record<string, InstrumentType> = {
  voice: InstrumentType.Voice,
  harp: InstrumentType.Harp,
  'hang drum': InstrumentType.HangDrum,
  glockenspiel: InstrumentType.Glockenspiel,
};

export const instrumentNames: Record<InstrumentType, string> = {
  [InstrumentType.Voice]: 'Voice',
  [InstrumentType.Harp]: 'Harp',
  [InstrumentType.HangDrum]: 'Hang Drum',
  [InstrumentType.Glockenspiel]: 'Glockenspiel',
};

export const instrumentFolders: Record<InstrumentType, string> = {
  [InstrumentType.Voice]: 'voice',
  [InstrumentType.Harp]: 'harp',
  [InstrumentType.HangDrum]: 'hang-drum',
  [InstrumentType.Glockenspiel]: 'glockenspiel',
};

/* --------------------------------- STATUS --------------------------------- */
export enum StatusType {
  Inactive = 0,
  Active = 1,
}

/* ---------------------------------- AUDIO --------------------------------- */
export type AudioRef = { note: string; audio: any };

/* ---------------------------------- NOTES --------------------------------- */
// c3 to g5
export const notes = [
  'c3',
  'c-3',
  'd3',
  'd-3',
  'e3',
  'f3',
  'f-3',
  'g3',
  'g-3',
  'a3',
  'a-3',
  'b3',
  'c4',
  'c-4',
  'd4',
  'd-4',
  'e4',
  'f4',
  'f-4',
  'g4',
  'g-4',
  'a4',
  'a-4',
  'b4',
  'c5',
  'c-5',
  'd5',
  'd-5',
  'e5',
  'f5',
  'f-5',
  'g5',
];

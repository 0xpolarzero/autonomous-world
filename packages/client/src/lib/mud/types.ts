/* ------------------------------- INSTRUMENTS ------------------------------ */
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

/* --------------------------------- STATUS --------------------------------- */
export enum StatusType {
  Inactive = 0,
  Active = 1,
}

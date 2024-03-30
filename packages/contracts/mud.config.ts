import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    InstrumentType: ["Voice", "Harp", "HangDrum", "Glockenspiel"],
    StatusType: ["Inactive", "Active"],
  },
  tables: {
    /* --------------------------------- GLOBAL --------------------------------- */
    // The bounds of the world (a parcel)
    Bounds: {
      schema: {
        minX: "int32",
        minY: "int32",
        minZ: "int32",
        maxX: "int32",
        maxY: "int32",
        maxZ: "int32",
      },
      key: [],
    },
    // The amount of instruments in the world
    Count: {
      schema: { value: "uint32" },
      key: [],
    },
    /* ------------------------------- INSTRUMENTS ------------------------------ */
    // The position of an instrument in the world
    Position: {
      schema: {
        id: "bytes32",
        x: "int32",
        y: "int32",
        z: "int32",
      },
      key: ["id"],
    },
    // The metadata of an instrument
    Metadata: {
      schema: {
        id: "bytes32",
        color: "bytes3",
        name: "string",
      },
      key: ["id"],
    },
    // The actualy instrument played by an entity
    Instrument: "InstrumentType",
    // The status of an instrument (e.g. active: not hidden, playing)
    Status: "StatusType",
  },
});

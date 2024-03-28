import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  tables: {
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
        hidden: "bool",
        name: "string",
      },
      key: ["id"],
    },
    // The amount of instruments in the world
    Count: {
      schema: { value: "uint32" },
      key: [],
    },
    /* --------------------------------- TERRAIN -------------------------------- */
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
  },
});

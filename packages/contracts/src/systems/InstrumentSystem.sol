// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Bounds, BoundsData, Count, Metadata, Position, PositionData} from "../codegen/index.sol";

// TODO Fuzz this to check (written quickly)
function checkBounds(BoundsData memory bounds, PositionData memory pos) pure returns (int32) {
    int32 x = pos.x;
    int32 y = pos.y;
    int32 z = pos.z;

    int32 xMin = bounds.minX;
    int32 yMin = bounds.minY;
    int32 zMin = bounds.minZ;

    int32 xMax = bounds.maxX;
    int32 yMax = bounds.maxY;
    int32 zMax = bounds.maxZ;

    // Calculate the distance from the bounds (considering negative distances as inside the bounds)
    int32 xDist = x < xMin ? xMin - x : x > xMax ? x - xMax : int32(0);
    int32 yDist = y < yMin ? yMin - y : y > yMax ? y - yMax : int32(0);
    int32 zDist = z < zMin ? zMin - z : z > zMax ? z - zMax : int32(0);

    return xDist + yDist + zDist;
}

contract InstrumentSystem is System {
    // Emit the distance from the bounds for information
    error OUT_OF_BOUNDS(int32 distance);

    function add(string memory name, int32 x, int32 y, int32 z) public {
        // Get the current amount of instruments, and generate an entity ID
        uint32 count = Count.get();
        bytes32 entityId = keccak256(abi.encode(_msgSender(), count));

        // Check if the instrument is within the bounds of the world
        // We wouldn't allow this to happen in the UI, but that's not the only way to add instruments
        BoundsData memory bounds = Bounds.get();
        PositionData memory position = PositionData(x, y, z);
        int32 dist = checkBounds(bounds, position);
        if (dist > 0) {
            revert OUT_OF_BOUNDS(dist);
        }

        // Set the initial position of the instrument, and its metadata
        Position.set(entityId, position);
        Metadata.set(entityId, name);

        // Update the amount of instruments
        Count.set(count + 1);
    }

    function move(uint32 index, int32 x, int32 y, int32 z) public {
        // Get the entity ID of the instrument
        // We could pass it directly, but this is a more friendly way to do so (keep hashing here, pass
        // readable parameters from the UI)
        bytes32 entityId = keccak256(abi.encode(_msgSender(), index));

        // Check if the new position is within the bounds of the world
        BoundsData memory bounds = Bounds.get();
        PositionData memory newPosition = PositionData(x, y, z);
        int32 dist = checkBounds(bounds, newPosition);
        if (dist > 0) {
            revert OUT_OF_BOUNDS(dist);
        }

        // Update the position of the instrument
        Position.set(entityId, newPosition);
    }
}

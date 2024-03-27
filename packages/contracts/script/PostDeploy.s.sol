// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {StoreSwitch} from "@latticexyz/store/src/StoreSwitch.sol";

import {IWorld} from "../src/codegen/world/IWorld.sol";
import {Bounds, BoundsData, Count} from "../src/codegen/index.sol";

import "../src/constants.sol";

contract PostDeploy is Script {
    function run(address worldAddress) external {
        // Specify a store so that you can use tables directly in PostDeploy
        StoreSwitch.setStoreAddress(worldAddress);

        // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Set the initial bounds of the world
        // min x, min y, min z, max x, max y, max z
        Bounds.set(BoundsData(MIN_X, MIN_Y, MIN_Z, MAX_X, MAX_Y, MAX_Z));
        // Set the initial instruments count
        Count.set(0);

        vm.stopBroadcast();
    }
}

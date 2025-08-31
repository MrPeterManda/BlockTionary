// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ScoreContract} from "../contracts/ScoreContract.sol";

contract DeployScore is Script {
    function run() external {
        vm.startBroadcast();
        new ScoreContract();
        vm.stopBroadcast();
    }
}
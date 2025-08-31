// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ScoreContract} from "../contracts/ScoreContract.sol";

contract DeployScore is Script {
    address constant DEPLOYED_CONTRACT = 0x2E86B1483387cA7496f18674094DdA867e88f13f;
    
    function run() external returns (address) {
        vm.startBroadcast();
        ScoreContract score = ScoreContract(DEPLOYED_CONTRACT);
        vm.stopBroadcast();
        return address(score);
    }
}
// SPDX-License-Identifier: MIT

// Interactive deployment and verification script
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {ScoreContract} from "../contracts/ScoreContract.sol";

contract DeployAndVerify is Script {
    function run() external {
        // Prompt for private key
        string memory privateKey = vm.readLine("Enter your private key (without 0x prefix): ");
        
        // Set up deployer
        vm.startBroadcast(vm.parseBytes32(privateKey));
        
        // Deploy contract with consistent settings
        ScoreContract scoreContract = new ScoreContract();
        
        vm.stopBroadcast();
        
        // Output verification command
        string memory verifyCmd = string.concat(
            "forge verify-contract --chain-id 8453 \\
            --compiler-version v0.8.30 \\
            --optimize --optimizer-runs 200 \\
            ", vm.toString(address(scoreContract)), " \\
            base-mini-app/blocktionary_/contracts/ScoreContract.sol:ScoreContract"
        );
        
        // Print instructions
        console.log("\nContract deployed at:", address(scoreContract));
        console.log("\nTo verify, run this command:");
        console.log(verifyCmd);
    }
}
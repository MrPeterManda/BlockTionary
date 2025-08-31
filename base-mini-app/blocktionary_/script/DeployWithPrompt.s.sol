// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {ScoreContract} from "../src/ScoreContract.sol";

contract DeployWithPrompt is Script {
    function startsWith(string memory str, string memory prefix) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);
        if (strBytes.length < prefixBytes.length) {
            return false;
        }
        for (uint i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) {
                return false;
            }
        }
        return true;
    }
    function run() external {
        // Prompt for private key
        // Use environment variable for private key
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
    if (!startsWith(privateKeyStr, "0x")) {
        privateKeyStr = string.concat("0x", privateKeyStr);
    }
    uint256 deployerPrivateKey = vm.parseUint(privateKeyStr);
        
        // Deploy contract
        vm.startBroadcast(deployerPrivateKey);
        ScoreContract scoreContract = new ScoreContract();
        vm.stopBroadcast();
        
        // Display deployment info
        console.log("\n=== Deployment Successful ===");
        console.log("Contract Address: ", address(scoreContract));
        console.log("\n=== Verification Command ===");
        console.log("Run this command to verify on Basescan:");
        console.log("forge verify-contract %s ./src/ScoreContract.sol:ScoreContract --chain-id 8453 --verifier-url https://api.basescan.org/api --etherscan-api-key $BASESCAN_API_KEY --compiler-version v0.8.30+commit.8d80080 --optimize --optimizer-runs 200", address(scoreContract));
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {ScoreContract} from "../src/ScoreContract.sol";

contract DeployAndVerify is Script {
    ScoreContract public scoreContract;

    function setUp() public {}

    function run() public {
        string memory privateKeyInput = vm.readLine("Enter your private key (without 0x prefix): ");
        uint256 deployerPrivateKey = vm.parseUint(privateKeyInput);
        vm.startBroadcast(deployerPrivateKey);

        scoreContract = new ScoreContract();

        vm.stopBroadcast();

        // Output verification command
        console.log("To verify run:");
        console.log("forge verify-contract %s ./src/ScoreContract.sol:ScoreContract --chain-id 8453 --verifier-url https://api.basescan.org/api --etherscan-api-key $BASESCAN_API_KEY --compiler-version v0.8.30+commit.8d80080 --optimize --optimizer-runs 200", address(scoreContract));
    }
}
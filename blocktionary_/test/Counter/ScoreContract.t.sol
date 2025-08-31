// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ScoreContract.sol";

contract ScoreContractTest is Test {
    ScoreContract public scoreContract;
    address constant DEPLOYED_CONTRACT = 0x2E86B1483387cA7496f18674094DdA867e88f13f;

    function setUp() public {
        scoreContract = ScoreContract(DEPLOYED_CONTRACT);
    }

    function testIncrementScore() public {
        address testUser = address(1);
        uint256 initialScore = scoreContract.scores(testUser);
        
        vm.prank(testUser);
        scoreContract.incrementScore();
        
        uint256 newScore = scoreContract.scores(testUser);
        assertEq(newScore, initialScore + 1, "Score should increment by 1");
    }
}
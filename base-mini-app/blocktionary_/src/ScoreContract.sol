// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

contract ScoreContract {
    mapping(address => uint256) public scores;

    function setScore(address user, uint256 score) public {
        scores[user] = score;
    }

    function incrementScore(address user) public {
        scores[user]++;
    }
}
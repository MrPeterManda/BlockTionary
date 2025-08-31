// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract ScoreContract {
    mapping(address => uint256) public scores;
    mapping(address => bool) public connectedWallets;
    uint256 public totalUsers;
    
    event ScoreRecorded(address indexed user, uint256 score);
    event WalletConnected(address indexed wallet);
    
    function recordScore(uint256 score) external {
        if (scores[msg.sender] == 0) {
            totalUsers++;
        }
        scores[msg.sender] = score;
        emit ScoreRecorded(msg.sender, score);
    }
    
    function trackConnection(address wallet) external {
        if (!connectedWallets[wallet]) {
            connectedWallets[wallet] = true;
            emit WalletConnected(wallet);
        }
    }
    
    function getScore(address user) external view returns (uint256) {
        return scores[user];
    }
}
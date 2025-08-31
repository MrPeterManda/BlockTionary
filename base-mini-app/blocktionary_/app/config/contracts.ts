import { Address } from 'viem';

export const CONTRACT_ADDRESSES = {
  // Mainnet
  base: {
    scoring: '0x2E86B1483387cA7496f18674094DdA867e88f13f' as Address,
    nftRewards: '0x...' as Address, // Will be replaced after deployment
    tipping: '0x...' as Address, // Replace with actual tipping contract
  },
  // Testnet
  baseSepolia: {
    scoring: '0x...' as Address, // Replace with testnet scoring contract
    nftRewards: '0x...' as Address, // Replace with testnet NFT contract
    tipping: '0x...' as Address, // Replace with testnet tipping contract
  }
};

export const NFT_METADATA = {
  beginner: {
    name: 'Blocktionary Beginner',
    description: 'Awarded for completing your first quiz',
    image: '/nfts/beginner.svg' // Path to your NFT image
  },
  expert: {
    name: 'Blocktionary Expert',
    description: 'Awarded for scoring 100% on any quiz',
    image: '/nfts/expert.svg' // Path to your NFT image
  }
};

export const TIP_AMOUNTS = {
  small: 0.01, // ETH
  medium: 0.05, // ETH
  large: 0.1 // ETH
};
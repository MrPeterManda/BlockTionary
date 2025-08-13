export const blockchainQuestions = [
  {
    id: 1,
    term: "Wallet",
    definition: "A digital tool that stores your cryptocurrency and allows you to send and receive transactions.",
    hint: "Think of it like your physical wallet, but instead of holding cash and cards, it holds digital coins and tokens.",
    difficulty: "beginner",
    category: "basics"
  },
  {
    id: 2,
    term: "Blockchain",
    definition: "A distributed ledger technology that records transactions across multiple computers in a secure and transparent way.",
    hint: "Imagine a public notebook that everyone can read, but no one can erase or change what's already written.",
    difficulty: "beginner",
    category: "basics"
  },
  {
    id: 3,
    term: "Smart Contract",
    definition: "Self-executing contracts with the terms directly written into code that automatically execute when conditions are met.",
    hint: "Like a vending machine - you put in money, select an item, and it automatically gives you the product without needing a person.",
    difficulty: "intermediate",
    category: "defi"
  },
  {
    id: 4,
    term: "Hash",
    definition: "A unique digital fingerprint created by a mathematical function that represents data in a fixed-length string.",
    hint: "Like a fingerprint for your data - even tiny changes create a completely different 'fingerprint'.",
    difficulty: "intermediate",
    category: "technical"
  },
  {
    id: 5,
    term: "Gas Fee",
    definition: "A small payment required to process transactions on the blockchain network.",
    hint: "Like paying a toll to use a motorway - you pay a small fee to use the network's infrastructure.",
    difficulty: "beginner",
    category: "basics"
  },
  {
    id: 6,
    term: "Token",
    definition: "A digital asset created on a blockchain that can represent ownership, access rights, or other forms of value.",
    hint: "Like loyalty points at your favourite shop, but these can be traded, sent to others, and used across different platforms.",
    difficulty: "beginner",
    category: "basics"
  },
  {
    id: 7,
    term: "Private Key",
    definition: "A secret cryptographic key that gives you control over your cryptocurrency and proves ownership of your wallet.",
    hint: "Think of it as the master key to your house - whoever has it controls everything inside.",
    difficulty: "intermediate",
    category: "security"
  },
  {
    id: 8,
    term: "Public Key",
    definition: "A cryptographic address that others can use to send you cryptocurrency - it's safe to share publicly.",
    hint: "Like your home address - you can give it to anyone who needs to send you something, but it doesn't let them into your house.",
    difficulty: "intermediate",
    category: "security"
  },
  {
    id: 9,
    term: "Mining",
    definition: "The process of validating transactions and adding them to the blockchain whilst earning cryptocurrency rewards.",
    hint: "Think of it like being a bank clerk who processes transactions, but instead of a salary, you get paid per transaction processed.",
    difficulty: "beginner",
    category: "basics"
  },
  {
    id: 10,
    term: "DeFi",
    definition: "Decentralised Finance - financial services built on blockchain that operate without traditional intermediaries like banks.",
    hint: "Imagine banking services that run automatically without needing a physical bank building or staff.",
    difficulty: "intermediate",
    category: "defi"
  },
  {
    id: 11,
    term: "NFT",
    definition: "Non-Fungible Token - a unique digital certificate that proves ownership of a specific digital or physical item.",
    hint: "Like a certificate of authenticity for artwork, but for digital items like images, music, or collectibles.",
    difficulty: "intermediate",
    category: "nft"
  },
  {
    id: 12,
    term: "DAO",
    definition: "Decentralised Autonomous Organisation - a group that makes decisions collectively through blockchain-based voting.",
    hint: "Think of it as a club where every member gets to vote on important decisions, and the results are automatically implemented.",
    difficulty: "advanced",
    category: "governance"
  }
];

export type Question = typeof blockchainQuestions[0];

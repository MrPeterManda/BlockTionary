***

# Blocktionary – Blockchain Learning Quiz

_A modern web app for mastering blockchain concepts – powered by Llama 3 and prepped for rewarding on Base._

***

## Overview

Blocktionary offers an interactive way to learn blockchain terms:
- **Curated quiz content** for reliable practice.
- **AI (Llama 3)-powered quizzes** for fresh and dynamic learning.
- **Future-proofed Base blockchain integration** for on-chain rewards and achievements (coming soon).

***

## Features

- **Quiz Modes**
  - **Curated Collection:** Hand-selected blockchain questions.
  - **Live Llama 3:** AI-generated, always-updating questions.

- **Upcoming Blockchain Features (when ready for Base):**
  - On-chain scoring (record proof of achievement)
  - NFT rewards for high scores
  - ETH tipping for exceptional performance
  - Wallet integration with Coinbase and Base
  - Base ecosystem branding and Mini App compatibility

***

## Live Site

[https://blocktionary.netlify.app/](https://blocktionary.netlify.app/)

***

## Local Development

1. **Clone and install**
    ```bash
    git clone git@github.com:MrPeterManda/BlockTionary.git
    cd BlockTionary/base-mini-app/blocktionary_
    npm install
    ```

2. **Set environment variables**  
   Create a file called `.env` at the root of `base-mini-app/blocktionary_` with your required keys (for AI features, etc):

    ```
    GROQ_API_KEY=your_groq_api_key
    # When ready for Base, also add:
    # NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
    ```

3. **Start the application**
    ```bash
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000)

***

## Enabling Blockchain Features (when ready for Base)

Once Base OnchainKit API key is available Blocktionary can be launched as a Mini App:

1. **Uncomment blockchain code**
    - In `app/layout.tsx` and `app/components/Blocktionary.tsx`, uncomment all relevant imports and provider wrappers.
    - Remove the `BASE_ENABLED = false` override and switch to:
      ```js
      const BASE_ENABLED = !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
      ```

2. **Add API key**
    - In the same `.env` file, add:
      ```
      NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
      ```

3. **Configure (optional) smart contract addresses**
    - Add contract addresses for scoring, NFT rewards, and tipping if needed.

4. **Test all blockchain flows locally**
    - Connect wallet, run through on-chain scoring, mint a test achievement NFT, tip, etc.
    - Recommended: Test on Base Sepolia testnet before mainnet.

5. **Deploy to Netlify (with updated env vars)**
    - Netlify will automatically pick up the `.env` file variables in the build.

6. **Register on the Base Mini App portal**
    - Submit Blocktionary project link and description so users can discover it in the Mini App ecosystem.

***

## What’s Next

- [ ] Launch blockchain-powered rewards and scoring
- [ ] Release NFT badge artwork
- [ ] Expand quizzes/categories/personalisation

***

## Contributing

- Fork the repo, branch from `main`, and open a PR.
- Keep `.env` secret—never commit your keys to the repository.
- All major changes require an issue/PR discussion and review.

***

## License

MIT

***

## When ready for Base:

- Uncomment all Base web3 code
- Add OnchainKit API key to `.env`
- Test locally and on Netlify
- Ship on-chain quiz reward features & become a Base Mini App!

***

> Blocktionary: Learn. Play. Earn. On-chain. Stay Based.

***
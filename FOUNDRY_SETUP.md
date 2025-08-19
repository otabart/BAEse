# Foundry Smart Contract Development Setup

This project now includes Foundry for smart contract development on Base.

## Prerequisites

- Foundry is installed (already done)
- Environment variables configured in `.env`

## Quick Start

### 1. Compile Contracts
```bash
~/.foundry/bin/forge build
```

### 2. Run Tests
```bash
~/.foundry/bin/forge test
```

### 3. Deploy to Base Sepolia (Testnet)
```bash
# Set your private key and Basescan API key in .env first
~/.foundry/bin/forge script script/Deploy.s.sol --rpc-url baseSepolia --broadcast --verify
```

### 4. Deploy to Base Mainnet
```bash
# Set your private key and Basescan API key in .env first
~/.foundry/bin/forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

## Environment Variables Required

Add these to your `.env` file:

```env
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

## Contracts

- `src/UserProfile.sol` - Simple user profile contract for BAEse platform
- `script/Deploy.s.sol` - Deployment script

## Networks Configured

- **Base Sepolia (Testnet)**: `https://sepolia.base.org` (Chain ID: 84532)
- **Base Mainnet**: `https://mainnet.base.org` (Chain ID: 8453)

## Next Steps

1. Get Base Sepolia ETH from a faucet
2. Set your private key in `.env`
3. Get a Basescan API key for contract verification
4. Deploy and verify your contracts!
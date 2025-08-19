# 🔮 BAEsed: The Onchain Dating Prediction Market

BAEsed is a Tinder-like, swipe-based dating mini-app built for Farcaster and Base that transforms user dating milestones into engaging prediction markets. It features frictionless social login, embedded crypto wallets, and onchain profile creation.

## 🎯 Core Features

### ✅ Onchain Social Dating

- **Onchain Profiles**: Users create a permanent profile linked to their wallet address via the `UserProfile` smart contract, establishing an onchain identity
- **Swipe-to-Match Interface**: A familiar, Tinder-like UI allows users to swipe through profiles. This activity is tracked off-chain to fuel prediction markets
- **Onchain Matches**: The `createMatch()` function establishes an onchain link between two matched users

### ✅ Chemistry Predictions System

- **Chemistry Mode**: A separate feed where users predict the success of other couples' matches through intuitive swipe gestures
- **Time-Based Milestone Markets**: Automated creation of prediction markets with clear deadlines (7, 14, 30 days) around relationship milestones
- **USDC Settlement**: Real financial incentives with micro-stakes starting at $0.50 USDC, settled transparently on-chain
- **Community Validation**: Users help each other by predicting chemistry while earning rewards for correct predictions
- **Privacy-First Oracle**: Verifies outcomes without reading message content, using activity metrics and confirmations


### ✅ Seamless Onchain Experience

- **Frictionless Auth**: Leverages a user's existing Farcaster identity and OnchainKit's `<ConnectWallet />` component for easy onboarding.
- **Embedded Wallet**: Built-in wallet functionality powered by OnchainKit for smooth transactions on the Base blockchain.
- **Gasless Predictions**: Paymaster implementation covers gas fees for all prediction and claim transactions.
- **Micro-Stakes Design**: Start with just $0.50 USDC predictions, progressively unlock higher stakes as a Chemistry Expert.
- **Batch Claims**: Efficient claiming system for multiple winning predictions in a single transaction.

## 🎮 How It Works: The Dual-Feed Experience

### Discovery Mode: Finding Love

1. **Connect & Create Profile**  
   Users connect their wallet using OnchainKit and register on the `UserProfile` contract to establish their onchain identity.

2. **Swipe to Match**  
   Browse potential partners with a familiar swipe interface.

3. **Create Connections**  
   When two users mutually like each other, the `createMatch()` function is triggered, creating an onchain match.

---

### Chemistry Mode: Helping Others Find Love

1. **Browse Recent Matches**  
   Explore a dedicated Chemistry Lab feed featuring newly matched couples.

2. **Quick Predictions**  
   Instantly swipe right if you think a couple will succeed, or left if you’re not feeling the chemistry.

3. **Milestone Predictions**  
   Tap a match card to predict outcomes for specific relationship milestones:
   - 💬 **Will they exchange 10+ messages?**  
     _7-day market, $0.50 USDC_
   - ☕ **Will they meet up?**  
     _14-day market, $1.00 USDC_
   - 💕 **Will they go on 3+ dates?**  
     _30-day market, $2.00 USDC_
   - 🔥 **Will they still be chatting in 30 days?**  
     _$1.50 USDC_

---

4. **Market Resolution**  
   A privacy-preserving oracle verifies milestone outcomes when deadlines pass.

5. **Claim Rewards**  
   Batch claim your USDC winnings from correct predictions.

6. **Build Reputation**  
   Earn Chemistry Expert status and unlock higher-stake prediction markets.

## ��️ Architecture

```
📱 BAEsed Mini-App
├── 💕 Discovery Mode
│   ├── Swipe-to-Match Interface
│   ├── → Onchain UserProfile.sol Contract
│   └── → Match creation via smart contracts
├── 🔮 Chemistry Mode
│   ├── Match Prediction Feed
│   ├── Swipe-based Chemistry Voting
│   ├── Time-Bound Milestone Markets (7/14/30 days)
│   └── USDC Stake Management ($0.50-$100)
├── 📊 Prediction Settlement Engine
│   ├── 🏭 ChemistryMarketFactory.sol (Deploys time-bound markets)
│   ├── 📈 ChemistryPrediction.sol (USDC pools, settlement logic)
│   ├── 💰 USDC Integration (Base-native stablecoin)
│   └── 🤖 Privacy Oracle (Verifies outcomes without reading messages)
├── ⛽ Gasless Infrastructure
│   ├── Paymaster Contract (Covers all transaction fees)
│   └── Batch Claim System (Efficient multi-market claims)
├── 🔐 Frictionless Auth (Farcaster + OnchainKit)
└── 📦 Frontend (Next.js, MiniKit, OnchainKit)
```

### 🎯 Chemistry Predictions UI/UX

#### Main Chemistry Feed
- **Card Stack:** Displays a stack of match cards featuring recent couples.
- **Swipe Actions:**  
  - **Right:** Spark!  
  - **Left:** No Chemistry  
  - **Up:** Skip  
- **Community-Driven Scores:** Chemistry scores update dynamically as more users participate.
- **Engagement:** Smooth animations and haptic feedback enhance the experience.

#### Detailed Match View
- **Split-Screen Profiles:** Both users’ mini profiles shown side by side.
- **Milestone Predictions:** Multiple prediction options for relationship milestones, each showing live community percentages.
- **Community Insights:** Section for supportive comments and compatibility highlights.
- **Live Updates:** Real-time changes as predictions and outcomes evolve.

#### Gamification Features
- **Chemistry Streaks:** Earn rewards for consecutive correct predictions.
- **Expert Badges:** Highlight top predictors in various categories.
- **Daily Challenges:** Themed prediction tasks to encourage daily participation.
- **Vibe Points:** Non-monetary points that unlock special features (e.g., super likes).

### 🚀 Tech Stack

| Layer             | Technologies / Tools                                                                 |
|-------------------|-------------------------------------------------------------------------------------|
| **Frontend**      | Next.js 15, TypeScript, Tailwind CSS                                                |
| **Animations**    | Framer Motion, React Spring, @use-gesture/react                                     |
| **Blockchain**    | OnchainKit, MiniKit, Base, Wagmi, Viem, Hardhat                                     |
| **Smart Contracts** | Solidity (ChemistryMarketFactory, ChemistryPrediction, UserProfile)               |
| **State Management** | Zustand, React Query                                                             |
| **Storage**       | Off-chain DB (activity tracking), Redis (real-time chemistry scores)                |
| **Notifications** | React Hot Toast (prediction outcomes)                                               |

### 💫 User Experience Philosophy

- **Dating First, Predictions Second:** Prioritize helping users form meaningful connections; prediction features enhance, not overshadow, the dating experience.
- **Community Support:** Present predictions as a way for the community to support and encourage love, avoiding any gambling connotations.
- **Soft Language:** Use terms like _chemistry_, _vibes_, and _sparks_ instead of _markets_, _bets_, or _odds_ to foster a positive, welcoming atmosphere.
- **Privacy Conscious:** Display only essential, public compatibility signals—never private messages or sensitive profile details.
- **Progressive Disclosure:** Enable quick, intuitive swipes for initial impressions, with the option to access more detailed prediction views for deeper engagement.
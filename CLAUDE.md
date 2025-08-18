# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

BAEsed is a Tinder-like, swipe-based dating mini-app built for Farcaster and Base that transforms matchmaking into a community-driven experience through Chemistry Predictions. The app features a dual-feed system:

Discovery Mode: Traditional swipe-based dating to find matches
Chemistry Mode: Community predicts the success of other users' matches through intuitive swipe gestures and milestone predictions
Seamless Onchain Experience: Frictionless auth via Farcaster identity and embedded Base wallets

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🏗️ Architecture Overview

---

### 1. Tech Stack

- **Frontend:**  
  - Next.js 15  
  - TypeScript  
  - Tailwind CSS  
- **Blockchain:**  
  - OnchainKit  
  - MiniKit  
  - Base  
  - Wagmi  
  - Viem  
- **Animations:**  
  - Framer Motion  
  - React Spring  
  - @use-gesture/react  
- **State Management:**  
  - Zustand  
  - React Query  
- **Storage:**  
  - Redis (Upstash) for market data persistence  
- **UI:**  
  - React Hot Toast for notifications  

---

### 2. Core Application Structure

#### 2.1. MiniKit Provider Setup (`app/providers.tsx`)
- Wraps the app with `MiniKitProvider` from OnchainKit.
- Configures Base chain connection and auto theme detection.
- Sets up global toast notifications with custom styling.

#### 2.2. State Management (`lib/store.ts`)
- Uses Zustand to manage dual-mode state: Discovery & Chemistry.
- **Key Chemistry Mode State:**
  - `chemistryMatches`: Array of recent matches to predict on.
  - `currentChemistryIndex`: Current position in chemistry feed.
  - `userChemistryPredictions`: User's prediction history.
  - `chemistryScores`: Real-time chemistry scores for matches.
  - `currentMode`: `'discovery' | 'chemistry'`.

#### 2.3. Type Definitions (`lib/types.ts`)
- `ChemistryPrediction`: Structure for relationship milestone predictions.
- `ChemistryMatch`: Coupled users with match metadata.
- `ChemistryMilestone`: Prediction categories (messages, dates, etc.).
- `ChemistryScore`: Dynamic, community-driven compatibility rating.
- `UserProfile`: Farcaster-based profiles with chemistry expert stats.

#### 2.4. Key Components

- **ChemistryMode Component** (`app/components/ChemistryMode.tsx`):  
  - Main interface for Chemistry Predictions.
  - Dual-layer: quick swipes & detailed milestone predictions.
  - Swipe gestures: right (Spark!), left (No Chemistry), up (Skip).
  - Tap to open detailed prediction view with multiple milestones.

- **ChemistryFeed Component** (`app/components/ChemistryFeed.tsx`):  
  - Manages stack of match cards in Chemistry Mode.
  - Handles card animations and gesture input.
  - Shows both users in each match with limited profile info.
  - Displays evolving chemistry scores.

- **MatchDetailView Component** (`app/components/MatchDetailView.tsx`):  
  - Detailed view on chemistry card tap.
  - Shows both users’ mini profiles side-by-side.
  - Multiple milestone prediction options:
    - Message exchange (10+ messages)
    - Meeting (coffee date this week)
    - Relationship longevity (3+ dates, 30-day activity)

- **DiscoveryMode Component** (`app/components/DiscoveryMode.tsx`):  
  - Traditional dating swipe interface (SwipeStack).
  - Focuses on finding matches, no prediction elements.
  - Clear visual distinction from Chemistry Mode.

---

### 3. Backend Architecture

#### 3.1. API Routes

- `/api/chemistry/matches`: GET recent matches for chemistry predictions
- `/api/chemistry/predict`: POST user's chemistry prediction with USDC stake
- `/api/chemistry/milestones`: GET active time-bound markets with deadlines
- `/api/chemistry/reconcile`: Trigger milestone resolution when deadline passes
- `/api/chemistry/claim`: Batch claim USDC winnings from resolved markets
- `/api/chemistry/oracle/verify`: Privacy-preserving outcome verification

#### 3.2. Redis Integration (`lib/redis.ts`)

- Stores real-time chemistry scores: `chemistry:{matchId}`
- Caches market states: `market:{milestoneId}:pools`
- Tracks user positions: `user:{userId}:positions`
- Manages claimable balances: `user:{userId}:claimable`
- Uses TTL-based cache for deadline monitoring

#### 3.3. Database Schema

- **Time-bound milestone markets**
  ```sql
  CREATE TABLE chemistry_milestones (
    id UUID PRIMARY KEY,
    match_id UUID REFERENCES matches(id),
    milestone_type VARCHAR(50), -- e.g. MESSAGES_10, FIRST_DATE
    created_at TIMESTAMP,
    deadline TIMESTAMP, -- 7/14/30 days from creation
    spark_pool_usdc DECIMAL(10,6), -- 6 decimals for USDC
    no_spark_pool_usdc DECIMAL(10,6),
    resolved BOOLEAN DEFAULT false,
    outcome BOOLEAN,
    settlement_tx_hash VARCHAR(66)
  );
  ```

- **User USDC positions**
  ```sql
  CREATE TABLE chemistry_positions (
    user_id UUID,
    milestone_id UUID,
    prediction_type ENUM('spark', 'no_spark'),
    amount_usdc DECIMAL(10,6),
    potential_payout DECIMAL(10,6),
    claimed BOOLEAN DEFAULT false,
    claim_tx_hash VARCHAR(66)
  );
  ```

#### 3.4. Chemistry Prediction Smart Contracts

- **ChemistryMarketFactory Contract**
  - Deploys time-bound prediction markets (7, 14, 30 day deadlines)
  - Creates USDC-denominated markets with configurable stake amounts
  - Manages market lifecycle with automatic deadline enforcement
  - Tracks total value locked (TVL) across all chemistry markets

- **ChemistryPrediction Contract**
  - Handles USDC deposits via `predictSpark()` and `predictNoSpark()`
  - Maintains separate pools for "spark" vs "no spark" predictions
  - Proportional payout calculation based on pool sizes
  - Supports batch claiming for multiple resolved markets
  - Minimum stake: 0.50 USDC (500000 with 6 decimals)
  - Progressive stakes: $0.50 → $1.00 → $2.00 → $5.00 based on expertise

- **Settlement & Oracle System**
  - Privacy-preserving verification (no message content read)
  - Tracks encrypted message counts, date confirmations, activity metrics
  - Automatic settlement when deadlines pass
  - Gasless claiming via Paymaster contract

---

### 4. Environment Configuration

**Required environment variables for Chemistry Mode:**

- `USDC_CONTRACT_ADDRESS`: Base mainnet USDC contract
- `CHEMISTRY_FACTORY_ADDRESS`: Deployed factory contract address
- `PAYMASTER_ADDRESS`: Gasless transaction sponsor contract
- `CHEMISTRY_ORACLE_URL`: Privacy-preserving verification endpoint
- `MIN_STAKE_USDC`: Minimum prediction amount (default: 0.50)
- `CLAIM_BATCH_SIZE`: Max claims per transaction (default: 10)
- `REDIS_URL`: For caching market states and user positions
- `REDIS_TOKEN`: Authentication for cache access

---

### 5. UI/UX Design Principles

#### 5.1. Dual-Mode Navigation

- Clear tab separation: "Find Matches | Chemistry Lab"
- Distinct color schemes (warm for Discovery, purple/pink for Chemistry)
- Mode-specific haptic patterns and animations

#### 5.2. Progressive Disclosure in Chemistry Mode

- Quick swipe for gut feeling
- Tap for detailed milestone predictions
- Deep dive into community insights

#### 5.3. Privacy-First Chemistry Predictions

- No message content visible
- Limited profile information shown
- Focus on public signals and compatible interests
- Anonymous prediction aggregation

#### 5.4. Gamification Without Gambling

- "Chemistry Expert" badges (not monetary rankings)
- "Vibe Points" unlock features, not cash rewards
- Streak bonuses for consistent helpful predictions
- Daily chemistry challenges with themed focuses

---

### 6. Development Notes

#### 6.1. Chemistry Mode Implementation Priority

1. Binary chemistry predictions (Spark/No Spark)
2. Multiple milestone predictions
3. Community insights and comments
4. Chemistry Expert rankings and privileges

#### 6.2. Language and Framing

- Always use "chemistry," "vibes," "sparks" (not "bet," "market," "odds")
- Frame as "helping others find love," not "predicting outcomes"
- Emphasize community support over competition
- Celebrate relationship success before prediction accuracy

#### 6.3. Performance Optimizations

- Lazy load Chemistry Mode components
- Pre-fetch next 5 matches in chemistry feed
- Cache chemistry scores in Redis (1-minute TTL)
- Debounce swipe animations to prevent gesture conflicts

#### 6.4. Testing Considerations

- A/B test swipe sensitivity for chemistry predictions
- Monitor prediction participation vs. dating activity
- Track Chemistry Mode’s impact on matching
- Measure community sentiment around prediction features

#### 6.5. Error Handling

- Global error handling in `lib/error-handler.ts` with specific handlers for:
  - Failed chemistry predictions (graceful fallback to optimistic UI)
  - Chemistry score calculation errors (show "Building Chemistry" state)
  - Milestone tracking failures (queue for retry)

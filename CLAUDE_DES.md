## 1. Overview

BAEse is an innovative Tinder-like, swipe-based dating mini-app built for Farcaster and Base that transforms matchmaking into a community-driven experience through Chemistry Predictions. The application solves the problem of traditional dating apps' limited engagement by creating a dual-feed system where users both search for their own matches (Discovery Mode) and help predict the success of others' relationships (Chemistry Mode).

The target audience includes Farcaster users and Base ecosystem participants who want to find meaningful connections while participating in a supportive community prediction market. The system gamifies the matchmaking process through supportive community predictions rather than overt gambling mechanics, creating an engaging ecosystem where finding love is the primary focus, with USDC prediction rewards serving as fun bonuses for being a good wingman/wingwoman.

The overall approach leverages blockchain technology for transparent, trustless matching and prediction systems, while maintaining user privacy through privacy-preserving oracles. The key goals include creating an engaging dual-mode experience, implementing fair and transparent USDC-based prediction markets, maintaining user privacy, and building a supportive community around love and relationships.

## 2. Architecture

The system follows a modular Next.js architecture with clear separation between frontend components, blockchain interactions, and backend services. The architecture is designed to support both Discovery Mode (personal matching) and Chemistry Mode (community predictions) with shared data models and distinct user interfaces.

### Directory Structure
BAEse/
├── app/
│ ├── api/ # Next.js API routes for server-side logic
│ │ ├── markets/ # Prediction market API endpoints
│ │ ├── notify/ # Notification system endpoints
│ │ ├── predictions/ # Prediction management endpoints
│ │ └── webhook/ # External service webhooks
│ ├── components/ # Reusable React components
│ │ ├── discovery/ # Discovery Mode specific components
│ │ ├── chemistry/ # Chemistry Mode specific components
│ │ ├── shared/ # Components used across both modes
│ │ └── ui/ # Base UI components
│ ├── discovery/ # Discovery Mode pages and layouts
│ ├── chemistry/ # Chemistry Mode pages and layouts
│ ├── profile/ # User profile management
│ ├── layout.tsx # Root layout with wallet integration
│ ├── page.tsx # Landing page with mode selection
│ └── providers.tsx # App-wide context providers
├── lib/
│ ├── blockchain/ # Smart contract interactions
│ │ ├── contracts/ # Contract ABIs and addresses
│ │ ├── UserProfile.ts # User profile contract interface
│ │ ├── PredictionMarket.ts # Prediction market contract interface
│ │ └── Paymaster.ts # Gasless transaction handling
│ ├── services/ # Business logic services
│ │ ├── matching.ts # Discovery Mode matching logic
│ │ ├── predictions.ts # Chemistry Mode prediction logic
│ │ ├── oracle.ts # Privacy-preserving outcome verification
│ │ └── gamification.ts # Rewards and streak tracking
│ ├── stores/ # State management
│ │ ├── user.ts # User profile and auth state
│ │ ├── discovery.ts # Discovery Mode state
│ │ └── chemistry.ts # Chemistry Mode state
│ ├── types.ts # TypeScript type definitions
│ ├── utils.ts # Shared utility functions
│ └── constants.ts # App-wide constants
└── contracts/ # Smart contract source code
├── UserProfile.sol # On-chain user profile management
├── PredictionMarket.sol # Chemistry prediction markets
├── ChemistryOracle.sol # Privacy-preserving outcome verification
└── Paymaster.sol # Gasless transaction sponsorship

### Design Rationale

**Modularity**: Each component has a single, well-defined responsibility, which improves maintainability and allows for independent development and testing. Discovery and Chemistry modes are architecturally separated while sharing common data models.

**Separation of Concerns**: Isolating different parts of the application (UI components, blockchain interactions, business logic, state management) reduces coupling and simplifies modifications. The smart contract layer is completely separate from the frontend logic.

**Scalability**: The architecture is designed to handle growth by allowing components to be scaled independently. The API layer can be horizontally scaled, and blockchain interactions are optimized for batch operations.

**Privacy by Design**: Privacy-preserving patterns are built into the architecture from the ground up, with the oracle system designed to verify outcomes without accessing sensitive user data.

## 3. Components and Interfaces

### Component: UserProfileManager (lib/blockchain/UserProfile.ts)
**Purpose**: Manages onchain user profile creation, updates, and Chemistry Expert status tracking.

**Key Methods/Functions:**
- `createProfile()`: Creates a new onchain user profile linked to wallet address
- `updateChemistryStats()`: Updates prediction accuracy, streak counter, and vibe points
- `getProfileStatus()`: Retrieves current user profile and Chemistry Expert status
- `checkRegistrationStatus()`: Validates if user has completed onchain registration

**Interface:**
```typescript
interface UserProfileManager {
  createProfile(profileData: CreateProfileRequest): Promise<TransactionResult>;
  updateChemistryStats(address: string, stats: ChemistryStats): Promise<void>;
  getProfileStatus(address: string): Promise<UserProfileStatus>;
  checkRegistrationStatus(address: string): Promise<boolean>;
}

interface CreateProfileRequest {
  walletAddress: string;
  displayName: string;
  bio: string;
  interests: string[];
  location?: string;
}

interface ChemistryStats {
  totalPredictions: number;
  correctPredictions: number;
  currentStreak: number;
  vibePoints: number;
  totalEarnings: bigint;
}
```

**Design Decisions:**
- Uses OnchainKit for seamless wallet integration and transaction management
- Implements progressive disclosure for Chemistry Expert features based on accuracy thresholds
- Validates all inputs rigorously to fail fast and provide clear error messages

### Component: DiscoveryEngine (lib/services/matching.ts)
**Purpose**: Handles swipe-based profile discovery, matching logic, and mutual match creation.

**Key Methods/Functions:**
- `getDiscoveryStack()`: Returns filtered stack of potential matches for current user
- `processSwipeAction()`: Handles like/pass actions and checks for mutual matches
- `createMatch()`: Calls smart contract to establish onchain match
- `getMatchHistory()`: Retrieves user's match history and status

**Interface:**
```typescript
interface DiscoveryEngine {
  getDiscoveryStack(userId: string, filters: DiscoveryFilters): Promise<UserProfile[]>;
  processSwipeAction(action: SwipeAction): Promise<SwipeResult>;
  createMatch(user1: string, user2: string): Promise<Match>;
  getMatchHistory(userId: string): Promise<Match[]>;
}

interface SwipeAction {
  swiperId: string;
  targetId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

interface SwipeResult {
  isMatch: boolean;
  match?: Match;
  nextProfile?: UserProfile;
}
```

**Design Decisions:**
- Implements efficient filtering algorithms to prevent showing the same profile repeatedly
- Uses smart contract events to ensure match creation is verifiable and transparent
- Maintains swipe history for analytics while respecting privacy boundaries

### Component: PredictionMarketManager (lib/services/predictions.ts)
**Purpose**: Manages Chemistry Mode prediction markets, stake handling, and time-bound market resolution.

**Key Methods/Functions:**
- `getChemistryFeed()`: Returns recent matches available for predictions
- `createPrediction()`: Places USDC stake on relationship milestones
- `calculatePayouts()`: Determines winning distributions based on pool ratios
- `resolveMilestone()`: Triggers market resolution when deadlines pass

**Interface:**
```typescript
interface PredictionMarketManager {
  getChemistryFeed(userId: string): Promise<ChemistryMatch[]>;
  createPrediction(prediction: PredictionRequest): Promise<TransactionResult>;
  calculatePayouts(marketId: string, outcome: boolean): Promise<PayoutCalculation>;
  resolveMilestone(marketId: string, milestone: Milestone): Promise<void>;
}

interface PredictionRequest {
  matchId: string;
  predictorId: string;
  milestones: MilestoneBet[];
  totalStake: bigint;
}

interface MilestoneBet {
  milestone: 'messages' | 'first_date' | 'multiple_dates' | 'long_term';
  stake: bigint;
  prediction: boolean;
}
```

**Design Decisions:**
- Implements progressive stake limits based on user expertise level
- Uses Paymaster contract for gasless transaction experience
- Enforces strict time boundaries for each prediction milestone type

### Component: ChemistryOracle (lib/services/oracle.ts)
**Purpose**: Privacy-preserving verification of relationship outcomes without accessing sensitive user data.

**Key Methods/Functions:**
- `verifyMessageMilestone()`: Confirms message exchange via encrypted transaction records
- `verifyDateMilestone()`: Validates date confirmations through mutual opt-in proximity
- `verifyActivityMilestone()`: Checks ongoing activity via timestamp analysis
- `submitOutcome()`: Calls smart contract with verified milestone results

**Interface:**
```typescript
interface ChemistryOracle {
  verifyMessageMilestone(matchId: string, targetCount: number): Promise<boolean>;
  verifyDateMilestone(matchId: string): Promise<boolean>;
  verifyActivityMilestone(matchId: string, days: number): Promise<boolean>;
  submitOutcome(marketId: string, milestone: string, outcome: boolean): Promise<void>;
}

interface VerificationMetrics {
  messageCount?: number;
  dateConfirmed?: boolean;
  lastActivity?: Date;
  privacyScore: number; // Ensures no sensitive data was accessed
}
```

**Design Decisions:**
- Never accesses actual message content or private interaction data
- Uses cryptographic proofs and opt-in location sharing for date verification
- Implements transparency logs to prove privacy-preserving verification methods

### Component: GamificationEngine (lib/services/gamification.ts)
**Purpose**: Manages Chemistry Expert progression, rewards distribution, and streak tracking.

**Key Methods/Functions:**
- `updateAccuracy()`: Recalculates prediction accuracy after market resolution
- `processStreak()`: Tracks consecutive correct predictions and awards bonuses
- `awardVibePoints()`: Distributes points for various community contributions
- `checkExpertStatus()`: Determines if user qualifies for Chemistry Expert benefits

**Interface:**
```typescript
interface GamificationEngine {
  updateAccuracy(userId: string, correct: boolean): Promise<AccuracyStats>;
  processStreak(userId: string, correct: boolean): Promise<StreakResult>;
  awardVibePoints(userId: string, points: number, reason: string): Promise<void>;
  checkExpertStatus(userId: string): Promise<ExpertStatus>;
}

interface StreakResult {
  currentStreak: number;
  bonusUnlocked: boolean;
  bonusPercentage?: number;
  badgeEarned?: string;
}

interface ExpertStatus {
  isExpert: boolean;
  accuracy: number;
  maxStakeLimit: bigint;
  premiumFeatures: string[];
}
```

**Design Decisions:**
- Implements fair accuracy calculation that prevents gaming through small bets
- Awards streak bonuses to encourage consistent participation
- Uses tiered expert system to gradually unlock higher stakes and premium features

## 4. Data Models

### Core Data Structures

```typescript
// User Profile Data Model
interface UserProfile {
  walletAddress: string;
  fid: number;
  displayName: string;
  bio: string;
  avatar: string;
  interests: string[];
  location?: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    genderPreference: string[];
  };
  chemistryStats: ChemistryStats;
  privacySettings: PrivacySettings;
  createdAt: Date;
  lastActive: Date;
}

// Match Data Model
interface Match {
  id: string;
  user1: string;
  user2: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'hidden';
  chemistryScore: number;
  predictionCount: number;
  milestones: MatchMilestone[];
  privacyLevel: 'public' | 'limited' | 'private';
}

// Prediction Market Data Model
interface ChemistryMarket {
  id: string;
  matchId: string;
  milestones: MilestoneMarket[];
  totalPool: bigint;
  participantCount: number;
  status: 'active' | 'resolving' | 'resolved';
  createdAt: Date;
  resolutionDeadline: Date;
}

// Milestone Market Data Model
interface MilestoneMarket {
  type: 'messages' | 'first_date' | 'multiple_dates' | 'long_term';
  deadline: Date;
  yesPool: bigint;
  noPool: bigint;
  outcome?: boolean;
  resolved: boolean;
  defaultStake: bigint;
}

// User Prediction Data Model
interface UserPrediction {
  id: string;
  userId: string;
  marketId: string;
  milestones: MilestoneBet[];
  totalStake: bigint;
  potentialPayout: bigint;
  status: 'pending' | 'won' | 'lost' | 'partial';
  placedAt: Date;
  resolvedAt?: Date;
  actualPayout?: bigint;
}

// Privacy Settings Data Model
interface PrivacySettings {
  showInChemistryMode: boolean;
  allowLocationSharing: boolean;
  publicProfileFields: string[];
  messageDataSharing: 'none' | 'aggregate' | 'opt_in';
}
```

### Database Schema (Redis/Upstash)

```typescript
// Redis Key Patterns
const REDIS_KEYS = {
  USER_PROFILE: 'user:profile:{walletAddress}',
  USER_SWIPES: 'user:swipes:{userId}:{date}',
  MATCH_DATA: 'match:{matchId}',
  PREDICTION_MARKET: 'market:{marketId}',
  CHEMISTRY_FEED: 'feed:chemistry:{timestamp}',
  DISCOVERY_STACK: 'stack:discovery:{userId}',
  ACCURACY_STATS: 'stats:accuracy:{userId}',
  STREAK_DATA: 'streak:{userId}',
  NOTIFICATION_QUEUE: 'notifications:{userId}'
};

// Smart Contract Events Schema
interface ContractEvent {
  eventType: 'ProfileCreated' | 'MatchCreated' | 'PredictionPlaced' | 'MilestoneResolved';
  blockNumber: number;
  transactionHash: string;
  timestamp: Date;
  data: any;
}
```

## 5. Error Handling

### Error Categories

**User Input Errors**: Validation at the API boundary, returning 400 status codes with clear messages. All stake amounts, profile data, and swipe actions are validated before processing.

**Blockchain Transaction Errors**: Implement retry logic with exponential backoff for failed transactions. Use circuit breakers for smart contract interactions and provide fallback to user-paid gas when Paymaster fails.

**Privacy Violation Errors**: Immediately halt operations and log security events when oracle attempts to access restricted data. Implement automated privacy auditing to ensure compliance.

**External Service Failures**: Graceful degradation when notification services or oracle data feeds are unavailable. Cache critical data locally to maintain core functionality.

**USDC/Financial Errors**: Strict validation of stake amounts, allowances, and payout calculations. Implement double-entry accounting patterns for all financial operations.

### Error Handling Strategy

**Fail Fast**: Validate inputs and environmental dependencies early to prevent the system from running in a bad state. Reject invalid predictions immediately rather than processing them partially.

**Graceful Degradation**: In case of non-critical failures, the system should continue to operate with reduced functionality. Discovery Mode can function independently of Chemistry Mode infrastructure.

**Detailed Logging**: Log errors with sufficient context (like stack traces, user IDs, and transaction hashes) to aid in debugging. Maintain separate audit logs for financial operations.

**User-Friendly Messages**: Convert technical errors into actionable user guidance. For example, "Insufficient USDC allowance" becomes "Please approve USDC spending to place your prediction."

## 6. Testing Strategy

### Testing Approach

**Unit Testing**: Each component will be tested in isolation using mock dependencies to verify its logic. Smart contract interactions are mocked to test business logic independently of blockchain state.

**Integration Testing**: Test the interactions between components to ensure they work together as expected. Verify that Discovery Mode matches properly trigger Chemistry Mode market creation.

**End-to-End Testing**: Simulate real user scenarios to validate the complete workflow from wallet connection through prediction placement and resolution.

**Smart Contract Testing**: Comprehensive testing of all contract functions using Hardhat/Foundry test suites with mainnet forking for realistic testing conditions.

### Test Coverage Areas

**Core Business Logic**: Matching algorithms, prediction market calculations, and payout distribution formulas.

**Boundary Conditions**: Edge cases like minimum stakes, maximum expert limits, and deadline boundary conditions.

**Privacy Preservation**: Verify that oracle systems never access restricted user data and that privacy settings are respected.

**Financial Operations**: Test all USDC flows, stake calculations, and payout distributions with various pool sizes and participant counts.

**User Experience Flows**: Complete user journeys from onboarding through successful predictions and reward claiming.

## 7. Security Considerations

### Authentication & Authorization
Use OnchainKit and wallet-based authentication for secure user identification. Implement role-based access control (RBAC) to enforce Chemistry Expert permissions and admin functions.

### Input Validation
Sanitize all user-provided input to prevent injection attacks. Use parameterized queries for database access and validate all stake amounts and prediction parameters.

### Smart Contract Security
Implement comprehensive access controls, reentrancy guards, and overflow protection in all contracts. Use established patterns like OpenZeppelin's security modules.

### Privacy Protection
Never store or transmit sensitive user data. Implement zero-knowledge proofs for outcome verification where possible. Use encryption for all user communications metadata.

### Financial Security
Implement multi-signature controls for admin functions. Use time-locks for critical contract upgrades. Implement maximum stake limits and circuit breakers for unusual activity.

### Oracle Security
Use multiple data sources for outcome verification. Implement cryptographic proofs for all oracle submissions. Maintain transparent logs of all verification processes.

## 8. Performance Considerations

### Database Optimization
Use appropriate indexing on frequently queried columns (wallet addresses, match IDs, timestamps). Implement caching for read-heavy operations like user profiles and chemistry scores.

### Blockchain Interaction Optimization
Batch multiple operations into single transactions where possible. Use event indexing for efficient historical data retrieval. Implement optimistic UI updates with transaction confirmation.

### API Response Time
Use asynchronous workers for long-running tasks like market resolution. Optimize data serialization formats and implement response compression.

### Real-time Updates
Implement WebSocket connections for live chemistry score updates. Use Redis pub/sub for real-time notification delivery.

### Mobile Performance
Optimize swipe animations using React Spring and gesture libraries. Implement image lazy loading and progressive enhancement for slower connections.

### Scalability Planning
Design API endpoints to be horizontally scalable. Use CDN for static assets and implement database read replicas for high-traffic scenarios.
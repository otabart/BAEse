# Requirements Document - Chemistry Predictions Feature

## Introduction

BAEsed is an innovative Tinder-like, swipe-based dating mini-app built for Farcaster and Base that transforms matchmaking into a community-driven experience through Chemistry Predictions. The application features a dual-feed system where users both search for their own matches (Discovery Mode) and help predict the success of others' relationships (Chemistry Mode). By gamifying the matchmaking process through supportive community predictions rather than overt gambling mechanics, BAEsed creates an engaging ecosystem where finding love is the primary focus, with prediction rewards serving as fun bonuses for being a good wingman/wingwoman.

## Requirements

### Requirement 1: Onchain User Profile Creation and Management
**User Story:** As a new user, I want to create a permanent onchain profile linked to my wallet address, so that I can establish a verifiable digital identity for dating and chemistry predictions.

**Acceptance Criteria:**
- WHEN a user connects their wallet via OnchainKit THEN the system SHALL prompt them to register via the `UserProfile` smart contract
- WHEN a user completes the registration process THEN the system SHALL create a permanent onchain profile linked to their wallet address
- WHEN a user's profile is created THEN the system SHALL initialize their Chemistry Expert stats (prediction accuracy, streak counter, vibe points)
- WHEN a user attempts to access either Discovery or Chemistry Mode without a registered profile THEN the system SHALL redirect them to the profile creation flow

### Requirement 2: Discovery Mode - Swipe-Based Profile Discovery and Matching
**User Story:** As a user looking for love, I want to swipe through potential matches in a familiar interface, so that I can find meaningful connections.

**Acceptance Criteria:**
- WHEN a user enters Discovery Mode THEN the system SHALL display a stack of user profiles in a swipeable card format
- WHEN a user swipes right on a profile THEN the system SHALL record a "like" action
- WHEN a user swipes left on a profile THEN the system SHALL record a "pass" action and move to the next profile
- WHEN two users mutually like each other THEN the system SHALL call the `createMatch()` function to establish an onchain match
- WHEN a match is created THEN the system SHALL add it to the Chemistry Mode feed for community predictions

### Requirement 3: Chemistry Mode - Time-Bound Prediction Markets
**User Story:** As a community member, I want to predict the chemistry between newly matched couples through time-bound markets, so that I can help others find love while earning USDC rewards.

**Acceptance Criteria:**
- WHEN a user enters Chemistry Mode THEN the system SHALL display a feed of recent matches as swipeable cards
- WHEN a user swipes right on a match card THEN the system SHALL prompt for USDC stake amount (minimum $0.50)
- WHEN a user confirms a prediction THEN the system SHALL transfer USDC to the smart contract pool
- WHEN creating predictions THEN the system SHALL enforce time boundaries:
  - Message exchange predictions: 7-day deadline
  - First date predictions: 14-day deadline  
  - Multiple dates predictions: 30-day deadline
  - Long-term activity predictions: 30-day deadline
- WHEN deadlines pass THEN the system SHALL automatically trigger market resolution
- WHEN predictions are placed THEN the system SHALL use Paymaster for gasless transactions

### Requirement 4: USDC Stake Management and Progressive Tiers
**User Story:** As a Chemistry predictor, I want to stake USDC on specific relationship milestones with appropriate risk/reward tiers, so that I can earn proportional returns based on my confidence.

**Acceptance Criteria:**
- WHEN viewing the detailed prediction view THEN the system SHALL display stake amounts for each milestone:
  - "Exchange 10+ messages in 7 days" - Default: $0.50 USDC
  - "Meet up within 14 days" - Default: $1.00 USDC
  - "Go on 3+ dates in 30 days" - Default: $2.00 USDC
  - "Still chatting after 30 days" - Default: $1.50 USDC
- WHEN a user is new THEN the system SHALL limit maximum stake to $5.00 per prediction
- WHEN a user achieves Chemistry Expert status (70%+ accuracy) THEN the system SHALL unlock higher stake tiers up to $100
- WHEN placing a stake THEN the system SHALL show potential payout based on current pool ratios
- WHEN USDC allowance is insufficient THEN the system SHALL prompt for approval with clear explanation
- WHEN stake is confirmed THEN the system SHALL display transaction status with celebratory UI

### Requirement 5: Chemistry Score Visualization and Evolution
**User Story:** As a user, I want to see how the community views the chemistry between matches, so that I can make informed predictions and learn from collective wisdom.

**Acceptance Criteria:**
- WHEN a match has fewer than 10 predictions THEN the system SHALL display "⚡ Chemistry Unknown"
- WHEN a match reaches 10-25 predictions THEN the system SHALL display "⚡ Chemistry Building" with a warm glow
- WHEN a match reaches 25-50 predictions THEN the system SHALL display "⚡ Chemistry Strong 🔥"
- WHEN a match exceeds 50 predictions THEN the system SHALL display "⚡ Electric Chemistry ⚡"
- WHEN chemistry scores change significantly THEN the system SHALL animate the transition smoothly
- WHEN displaying scores THEN the system SHALL use warm colors for high chemistry and cool colors for low chemistry

### Requirement 6: Gamification with Real Rewards System
**User Story:** As an active predictor, I want to earn both recognition and USDC rewards for accurate predictions, building my reputation as a Chemistry Expert.

**Acceptance Criteria:**
- WHEN a user correctly predicts 5 matches in a row THEN the system SHALL award a "Chemistry Streak" badge and 10% bonus on next stake
- WHEN a user's overall prediction accuracy exceeds 70% THEN the system SHALL grant "Chemistry Expert" status with access to higher stakes
- WHEN a prediction resolves correctly THEN the system SHALL:
  - Distribute USDC proportional to stake and pool sizes
  - Award "Vibe Points" for leaderboard ranking
  - Update accuracy percentage publicly displayed
- WHEN displaying profiles in Chemistry Mode THEN the system SHALL show total USDC earned and accuracy rate
- WHEN vibe points accumulate THEN the system SHALL unlock premium features (super likes, boost visibility)
- WHEN showing prediction results THEN the system SHALL celebrate the relationship success first, then mention USDC earned

### Requirement 7: Privacy-Conscious Prediction Interface
**User Story:** As a matched user, I want my privacy protected while the community predicts our chemistry, so that I feel comfortable with the prediction system.

**Acceptance Criteria:**
- WHEN displaying matches in Chemistry Mode THEN the system SHALL show only limited profile information
- WHEN showing match details THEN the system SHALL NEVER display message content or private interactions
- WHEN presenting profiles THEN the system SHALL focus on public compatibility signals (shared interests, location proximity)
- WHEN aggregating predictions THEN the system SHALL maintain predictor anonymity
- WHEN users want to opt-out THEN the system SHALL provide options to hide their matches from Chemistry Mode

### Requirement 8: Privacy-Preserving Oracle and Settlement System
**User Story:** As a platform participant, I want predictions to be fairly resolved based on actual relationship outcomes without compromising user privacy, with automatic USDC distribution.

**Acceptance Criteria:**
- WHEN milestone deadlines are reached THEN the Chemistry Oracle SHALL verify outcomes through privacy-preserving metrics:
  - Message counts via encrypted transaction records (not content)
  - Date confirmations via mutual opt-in location proximity or user confirmation
  - Activity metrics via timestamp analysis without message access
- WHEN verifying outcomes THEN the oracle SHALL NEVER read actual message content or private data
- WHEN milestones resolve THEN the system SHALL call `settleMilestone()` with verified outcome
- WHEN settlement occurs THEN the system SHALL calculate proportional payouts:
  - Winners receive: (user_stake / winning_pool) * total_pool
  - Distribution happens automatically via smart contract
- WHEN users have winning predictions THEN they can batch claim multiple payouts in one gasless transaction
- WHEN showing results THEN the system SHALL celebrate relationship success with USDC rewards as a bonus mention

### Requirement 9: Dual-Mode Navigation and Visual Distinction
**User Story:** As a user, I want clear separation between finding my own matches and predicting others' chemistry, so that I can focus on one activity at a time.

**Acceptance Criteria:**
- WHEN the app loads THEN the system SHALL display clear navigation tabs: "Find Matches | Chemistry Lab"
- WHEN in Discovery Mode THEN the system SHALL use warm, romantic color schemes (reds, pinks)
- WHEN in Chemistry Mode THEN the system SHALL use mystical color schemes (purples, cosmic themes)
- WHEN switching modes THEN the system SHALL animate the transition with mode-specific haptic feedback
- WHEN in Chemistry Mode THEN card design SHALL show both matched users instead of single profiles
- WHEN navigating THEN the system SHALL maintain separate gesture patterns for each mode

### Requirement 10: Community Insights and Supportive Comments
**User Story:** As a Chemistry predictor, I want to share insights about why matches might work, so that I can contribute qualitative feedback beyond binary predictions.

**Acceptance Criteria:**
- WHEN viewing detailed match predictions THEN the system SHALL provide a comments section for community insights
- WHEN adding insights THEN users SHALL be able to highlight compatible interests or shared values
- WHEN displaying comments THEN the system SHALL prioritize supportive, constructive feedback
- WHEN moderating content THEN the system SHALL filter negative or inappropriate comments automatically
- WHEN insights prove helpful THEN the system SHALL award bonus vibe points to insightful predictors
- WHEN showing insights THEN the system SHALL display them as "Community Vibes" to maintain positive framing

### Requirement 12: Gasless Transaction Infrastructure
**User Story:** As a user, I want to place predictions and claim winnings without paying gas fees, so that the USDC stakes are my only cost.

**Acceptance Criteria:**
- WHEN a user places a prediction THEN the Paymaster contract SHALL cover all gas fees
- WHEN a user claims winnings THEN the batch claim function SHALL execute gaslessly
- WHEN the Paymaster balance is low THEN the system SHALL alert administrators before depletion
- WHEN gasless transactions fail THEN the system SHALL fallback to user-paid gas with clear notification
- WHEN users view transaction history THEN the system SHALL show USDC flows without gas fee complications
- WHEN onboarding new users THEN the system SHALL emphasize "no hidden fees" beyond USDC stakes
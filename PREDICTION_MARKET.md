# 🔮 Prediction Market Mini-App

A Tinder-like swipe-based prediction market built for Farcaster and Base, featuring frictionless social login and embedded crypto wallets.

## 🎯 Features Built

### ✅ Core Functionality
- **Swipe-based UI**: Tinder-like interface for making predictions
  - 👉 Swipe Right = YES prediction
  - 👈 Swipe Left = NO prediction  
  - 👆 Swipe Up = SKIP market
- **Real-time animations** using Framer Motion and React Spring
- **Toast notifications** for user feedback
- **State management** with Zustand store

### ✅ Integration Features
- **OnchainKit Integration**: Embedded wallet with Base blockchain
- **MiniKit Support**: Native Farcaster mini-app functionality
- **Frictionless Auth**: Uses existing Farcaster identity
- **Redis Storage**: Persistent data for markets and predictions

### ✅ UI/UX Components
- `PredictionCard`: Beautiful gradient cards with market info
- `SwipeStack`: Gesture-based card stack with smooth animations
- `PredictionMarket`: Main prediction interface component
- Responsive design optimized for mobile

### ✅ API Infrastructure  
- `/api/markets`: CRUD operations for prediction markets
- `/api/predictions`: User prediction management
- Redis-based data persistence
- RESTful API design

## 🎮 How to Use

1. **Connect Wallet**: Use the built-in OnchainKit wallet connection
2. **Start Predicting**: Click "Start Predicting" from the home screen
3. **Swipe to Predict**:
   - Swipe right for YES predictions
   - Swipe left for NO predictions
   - Swipe up to skip markets
4. **Get Feedback**: Toast notifications confirm your predictions

## 🏗️ Architecture

```
📱 Prediction Market Mini-App
├── 🎴 Swipe Interface (Tinder-like UX)
├── 🔐 Frictionless Auth (Farcaster + OnchainKit)
├── 💰 Embedded Wallet (Base blockchain)
├── 📊 Prediction Markets (Mock data + Redis)
├── 🏆 Real-time Feedback (Toast notifications)
└── 🔔 State Management (Zustand store)
```

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Animations**: Framer Motion, React Spring, @use-gesture/react
- **Blockchain**: OnchainKit, MiniKit, Base, Wagmi, Viem
- **State**: Zustand, React Query
- **Storage**: Upstash Redis
- **Notifications**: React Hot Toast

## 📝 Sample Markets

The app includes 4 sample prediction markets:
1. "Will ETH reach $4,000 by end of 2024?" (Crypto)
2. "Will Farcaster reach 1M daily active users?" (Social)
3. "Will Base TVL exceed $10B in 2024?" (DeFi)
4. "Will Bitcoin reach new ATH in 2024?" (Crypto)

## 🔮 Next Steps for Production

### Smart Contract Integration
- Deploy prediction market contracts on Base
- Integrate with OnchainKit transaction components
- Set up Paymaster for gasless transactions

### Enhanced Features
- **Social Integration**: Share predictions on Farcaster
- **Real-time Updates**: Live odds and market data
- **Leaderboards**: User rankings and achievements
- **Advanced Markets**: Multi-outcome predictions
- **Oracle Integration**: Chainlink for market resolution

### Production Considerations
- Input validation and security
- Rate limiting and anti-spam
- Database optimization
- Legal compliance for prediction markets

## 🎉 Demo Ready!

The app is now fully functional and ready for demo! Users can:
- Connect their wallets seamlessly
- Swipe through prediction markets
- Make predictions with smooth animations
- Get real-time feedback via notifications
- Navigate back and forth between screens

Perfect for showcasing at hackathons or as a Base/Farcaster mini-app demo!

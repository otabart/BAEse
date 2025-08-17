import { create } from 'zustand';
import { PredictionMarket, UserPrediction, UserProfile } from './types';

interface PredictionStore {
    // User state
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;

    // Markets state
    markets: PredictionMarket[];
    currentMarketIndex: number;
    setMarkets: (markets: PredictionMarket[]) => void;
    nextMarket: () => void;

    // Predictions state
    userPredictions: UserPrediction[];
    addPrediction: (prediction: UserPrediction) => void;

    // UI state
    isSwipeInProgress: boolean;
    setSwipeInProgress: (inProgress: boolean) => void;
    showPredictionModal: boolean;
    setShowPredictionModal: (show: boolean) => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
    // User state
    user: null,
    setUser: (user) => set({ user }),

    // Markets state
    markets: [],
    currentMarketIndex: 0,
    setMarkets: (markets) => set({ markets, currentMarketIndex: 0 }),
    nextMarket: () => set((state) => ({
        currentMarketIndex: Math.min(state.currentMarketIndex + 1, state.markets.length - 1)
    })),

    // Predictions state
    userPredictions: [],
    addPrediction: (prediction) => set((state) => ({
        userPredictions: [...state.userPredictions, prediction]
    })),

    // UI state
    isSwipeInProgress: false,
    setSwipeInProgress: (inProgress) => set({ isSwipeInProgress: inProgress }),
    showPredictionModal: false,
    setShowPredictionModal: (show) => set({ showPredictionModal: show }),
}));

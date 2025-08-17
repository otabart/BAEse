"use client";

import React, { useEffect } from 'react';
import { SwipeStack } from './SwipeStack';
import { usePredictionStore } from '@/lib/store';
import { SwipeAction, type PredictionMarket } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { Button } from './DemoComponents';

// Mock data - replace with API calls
const mockMarkets: PredictionMarket[] = [
    {
        id: '1',
        title: 'Will ETH reach $4,000 by end of 2024?',
        description: 'Ethereum has been showing strong momentum. Will it break the $4,000 barrier before 2025?',
        category: 'crypto',
        endDate: new Date('2024-12-31'),
        totalPool: BigInt(5.2 * 1e18),
        yesOdds: 65,
        noOdds: 35,
        imageUrl: '/hero.png',
        createdBy: 'cryptowhale.eth',
        status: 'active',
        tags: ['ethereum', 'price-prediction'],
    },
    {
        id: '2',
        title: 'Will Farcaster reach 1M daily active users?',
        description: 'The decentralized social protocol is growing rapidly. Can it hit the 1M DAU milestone?',
        category: 'farcaster',
        endDate: new Date('2024-06-30'),
        totalPool: BigInt(2.8 * 1e18),
        yesOdds: 42,
        noOdds: 58,
        createdBy: 'dan.eth',
        status: 'active',
        tags: ['farcaster', 'social', 'growth'],
    },
    {
        id: '3',
        title: 'Will Base TVL exceed $10B in 2024?',
        description: 'Base is gaining traction as an L2 solution. Will total value locked surpass $10 billion this year?',
        category: 'crypto',
        endDate: new Date('2024-12-31'),
        totalPool: BigInt(3.5 * 1e18),
        yesOdds: 55,
        noOdds: 45,
        imageUrl: '/hero.png',
        createdBy: 'basebuilder.eth',
        status: 'active',
        tags: ['base', 'tvl', 'defi'],
    },
    {
        id: '4',
        title: 'Will Bitcoin reach new ATH in 2024?',
        description: 'Bitcoin is approaching its previous all-time high. Will it break through and set a new record?',
        category: 'crypto',
        endDate: new Date('2024-12-31'),
        totalPool: BigInt(8.7 * 1e18),
        yesOdds: 72,
        noOdds: 28,
        imageUrl: '/hero.png',
        createdBy: 'bitcoinmaxi.eth',
        status: 'active',
        tags: ['bitcoin', 'ath', 'price'],
    },
];

interface PredictionMarketProps {
    setActiveTab: (tab: string) => void;
}

export function PredictionMarket({ setActiveTab }: PredictionMarketProps) {
    const { markets, setMarkets, nextMarket, currentMarketIndex } = usePredictionStore();
    const { address, isConnected } = useAccount();

    useEffect(() => {
        // Load markets from API
        setMarkets(mockMarkets);
    }, [setMarkets]);

    const handleSwipe = async (action: SwipeAction) => {
        if (!isConnected || !address) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            if (action.direction === 'up') {
                // Skip - just move to next
                toast('Skipped! 👆', { icon: '⏭️' });
            } else {
                // Make prediction
                const prediction = action.direction === 'right' ? 'YES' : 'NO';
                const emoji = action.direction === 'right' ? '🚀' : '📉';

                toast.success(`Predicted ${prediction}! ${emoji}`, {
                    duration: 2000,
                });

                // TODO: Call smart contract to place bet
                // await placeBet(action.marketId, action.prediction, action.amount);
            }

            // Move to next market
            nextMarket();

        } catch (error) {
            console.error('Swipe action failed:', error);
            toast.error('Failed to process prediction');
        }
    };

    // Check if we've gone through all markets
    const isComplete = currentMarketIndex >= markets.length;

    if (isComplete) {
        return (
            <div className="text-center space-y-6 animate-fade-in">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-[var(--app-foreground)]">
                    All caught up!
                </h2>
                <p className="text-[var(--app-foreground-muted)]">
                    You&apos;ve seen all available prediction markets. Check back later for more!
                </p>
                <Button onClick={() => setActiveTab("home")}>
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
                    🔮 Prediction Market
                </h1>
                <p className="text-[var(--app-foreground-muted)] text-sm">
                    Swipe to predict the future
                </p>
            </div>

            {/* Swipe Stack */}
            <div className="h-[500px]">
                <SwipeStack markets={markets} onSwipe={handleSwipe} />
            </div>

            {/* Instructions */}
            <div className="text-center text-[var(--app-foreground-muted)] text-xs">
                <div className="flex justify-center items-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-400">👈</span>
                        <span>NO</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-400">👆</span>
                        <span>SKIP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400">👉</span>
                        <span>YES</span>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => setActiveTab("home")}
                    className="text-[var(--app-foreground-muted)]"
                >
                    ← Back to Home
                </Button>
            </div>
        </div>
    );
}

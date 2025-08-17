"use client";

import React, { useEffect } from 'react';
import { SwipeStack } from '../components/SwipeStack';
import { usePredictionStore } from '@/lib/store';
import { SwipeAction, type PredictionMarket } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';

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

export default function PredictionMarketPage() {
    const { markets, setMarkets, nextMarket } = usePredictionStore();
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        🔮 Prediction Market
                    </h1>
                    <p className="text-gray-300">
                        Swipe to predict the future
                    </p>
                </div>

                {/* Swipe Stack */}
                <div className="max-w-md mx-auto">
                    <SwipeStack markets={markets} onSwipe={handleSwipe} />
                </div>

                {/* Instructions */}
                <div className="mt-8 text-center text-gray-400 text-sm">
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
            </div>
        </div>
    );
}

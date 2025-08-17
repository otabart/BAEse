"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PredictionMarket } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface PredictionCardProps {
    market: PredictionMarket;
    onSwipe: (direction: 'left' | 'right' | 'up') => void;
    style?: React.CSSProperties;
}

export function PredictionCard({ market, style }: PredictionCardProps) {
    const timeRemaining = formatDistanceToNow(market.endDate, { addSuffix: true });
    const totalPool = Number(market.totalPool) / 1e18; // Convert from wei

    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden"
            style={style}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Background Image */}
            {market.imageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${market.imageUrl})` }}
                />
            )}

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between text-white">
                {/* Header */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                            {market.category}
                        </span>
                        <span className="text-xs opacity-75">
                            {timeRemaining}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold leading-tight">
                        {market.title}
                    </h2>

                    <p className="text-sm opacity-90 line-clamp-3">
                        {market.description}
                    </p>
                </div>

                {/* Odds Display */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {market.yesOdds}%
                            </div>
                            <div className="text-xs opacity-75">YES</div>
                        </div>
                        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-400">
                                {market.noOdds}%
                            </div>
                            <div className="text-xs opacity-75">NO</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-lg font-semibold">
                            💰 {totalPool.toFixed(2)} ETH
                        </div>
                        <div className="text-xs opacity-75">Total Pool</div>
                    </div>
                </div>

                {/* Swipe Instructions */}
                <div className="flex justify-between items-center text-xs opacity-60">
                    <span>← NO</span>
                    <span>↑ SKIP</span>
                    <span>YES →</span>
                </div>
            </div>
        </motion.div>
    );
}

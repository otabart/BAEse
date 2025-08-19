"use client";

import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { PredictionCard } from './PredictionCard';
import { PredictionMarket, SwipeAction } from '@/lib/types';
import { usePredictionStore } from '@/lib/store';

interface SwipeStackProps {
    markets: PredictionMarket[];
    onSwipe: (action: SwipeAction) => void;
}

export function SwipeStack({ markets, onSwipe }: SwipeStackProps) {
    const { currentMarketIndex, setSwipeInProgress } = usePredictionStore();
    const [gone] = useState(() => new Set());
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const [props, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rot: 0,
        opacity: 1,
    }));

    const bind = useDrag(({ args: [index], active, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
        const trigger = Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2;
        const isGone = !active && trigger;
        const dir = xDir < 0 ? -1 : xDir > 0 ? 1 : 0;
        const upDir = yDir < 0 ? -1 : 0;

        if (!active) {
            setSwipeInProgress(false);
            setSwipeDirection(null);
        } else {
            setSwipeInProgress(true);
            if (Math.abs(mx) > 50) {
                setSwipeDirection(mx > 0 ? 'right' : 'left');
            } else {
                setSwipeDirection(null);
            }
        }

        if (isGone) gone.add(index);

        api({
            x: isGone ? (200 + window.innerWidth) * dir : active ? mx : 0,
            y: isGone && upDir === -1 ? -200 : active ? my : 0,
            rot: active ? mx / 100 + (isGone ? dir * 10 * vx : 0) : 0,
            scale: active ? 1.1 : 1,
            opacity: isGone ? 0 : 1,
            config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
            onRest: () => {
                if (isGone) {
                    const market = markets[currentMarketIndex];
                    if (market) {
                        let swipeDirection: 'left' | 'right' | 'up';
                        let prediction: boolean | undefined;

                        if (upDir === -1) {
                            swipeDirection = 'up';
                        } else if (dir === -1) {
                            swipeDirection = 'left';
                            prediction = false;
                        } else {
                            swipeDirection = 'right';
                            prediction = true;
                        }

                        onSwipe({
                            direction: swipeDirection,
                            marketId: market.id,
                            prediction,
                            amount: BigInt(0.01 * 1e18), // Default 0.01 ETH
                        });
                    }
                }
            },
        });
    });

    const currentMarket = markets[currentMarketIndex];
    const nextMarket = markets[currentMarketIndex + 1];

    if (!currentMarket) return null;

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* Next card (background) */}
            {nextMarket && (
                <div className="absolute inset-4">
                    <PredictionCard
                        market={nextMarket}
                        onSwipe={() => { }}
                        style={{ transform: 'scale(0.95)', opacity: 0.5 }}
                    />
                </div>
            )}

            {/* Current card */}
            <animated.div
                {...bind(currentMarketIndex)}
                style={{
                    ...props,
                    touchAction: 'none',
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
                <PredictionCard
                    market={currentMarket}
                    onSwipe={() => { }}
                />
            </animated.div>

            {/* Swipe indicators */}
            {swipeDirection && (
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-6xl font-bold ${swipeDirection === 'right' ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {swipeDirection === 'right' ? '✓' : '✗'}
                </div>
            )}
        </div>
    );
}

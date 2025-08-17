import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { PredictionMarket } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Get markets from Redis
        let markets: PredictionMarket[] = [];

        if (redis) {
            const keys = await redis.keys('market:*');
            const marketData = await Promise.all(
                keys.map(key => redis!.get<PredictionMarket>(key))
            );

            markets = marketData
                .filter((market): market is PredictionMarket => market !== null)
                .filter(market => !category || market.category === category)
                .filter(market => market.status === 'active')
                .sort((a, b) => Number(b.totalPool - a.totalPool))
                .slice(0, limit);
        }

        return NextResponse.json({ markets });
    } catch (error) {
        console.error('Failed to fetch markets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch markets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const market: Omit<PredictionMarket, 'id'> = await request.json();

        const marketId = `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fullMarket: PredictionMarket = {
            ...market,
            id: marketId,
        };

        if (redis) {
            await redis.set(`market:${marketId}`, fullMarket);
        }

        return NextResponse.json({ market: fullMarket });
    } catch (error) {
        console.error('Failed to create market:', error);
        return NextResponse.json(
            { error: 'Failed to create market' },
            { status: 500 }
        );
    }
}

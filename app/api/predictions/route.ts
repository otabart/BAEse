import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { UserPrediction } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const prediction: Omit<UserPrediction, 'id' | 'timestamp' | 'status'> = await request.json();

        const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fullPrediction: UserPrediction = {
            ...prediction,
            id: predictionId,
            timestamp: new Date(),
            status: 'pending',
        };

        if (redis) {
            // Store prediction
            await redis.set(`prediction:${predictionId}`, fullPrediction);

            // Add to user's predictions list
            await redis.lpush(`user:${prediction.userId}:predictions`, predictionId);

            // Update market betting pool
            // This would integrate with smart contracts in production
        }

        return NextResponse.json({ prediction: fullPrediction });
    } catch (error) {
        console.error('Failed to create prediction:', error);
        return NextResponse.json(
            { error: 'Failed to create prediction' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !redis) {
            return NextResponse.json({ predictions: [] });
        }

        const predictionIds = await redis.lrange(`user:${userId}:predictions`, 0, -1);
        const predictions = await Promise.all(
            predictionIds.map(id => redis!.get<UserPrediction>(`prediction:${id}`))
        );

        return NextResponse.json({
            predictions: predictions.filter((p): p is UserPrediction => p !== null)
        });
    } catch (error) {
        console.error('Failed to fetch predictions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch predictions' },
            { status: 500 }
        );
    }
}

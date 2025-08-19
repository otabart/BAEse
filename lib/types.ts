export interface PredictionMarket {
    id: string;
    title: string;
    description: string;
    category: 'crypto' | 'sports' | 'social' | 'farcaster';
    endDate: Date;
    totalPool: bigint;
    yesOdds: number;
    noOdds: number;
    imageUrl?: string;
    createdBy: string;
    status: 'active' | 'resolved' | 'cancelled';
    outcome?: boolean;
    tags: string[];
}

export interface UserPrediction {
    id: string;
    marketId: string;
    userId: string;
    prediction: boolean; // true = YES, false = NO
    amount: bigint;
    odds: number;
    timestamp: Date;
    status: 'pending' | 'won' | 'lost';
}

export interface UserProfile {
    fid: number;
    username: string;
    displayName: string;
    avatar: string;
    walletAddress?: string;
    totalPredictions: number;
    correctPredictions: number;
    totalWinnings: bigint;
    rank: number;
    joinDate: Date;
}

export interface SwipeAction {
    direction: 'left' | 'right' | 'up';
    marketId: string;
    prediction?: boolean;
    amount?: bigint;
}

export interface Community {
    id: string;
    name: string;
    description: string;
    longDescription: string;
    memberCount: number;
    imageUrl?: string;
    tags?: string[];
    stats: {
        activeBorrows: number;
        totalItemsShared: number;
        successfulTransactions: number;
        averageRating: number;
    };
    rules?: string[];
    location?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

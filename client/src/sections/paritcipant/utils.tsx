export interface ProfileData {
    _id: string;
    username: string;
    name: string;
    email: string;
    gender: string;
    number: string;
    address: string;
    avatar: {
        public_id: string;
        url: string;
    };
    cover: {
        public_id: string;
        url: string;
    };
    isVerified: boolean;
    certified: boolean;
    role: string;
    status: string;
    referredBy: {
        _id: string;
        username: string;
        name: string;
        __id: string;
    };
    rewardPoints: number;
    referralCount: number;
    __id: string;
    createdAt: string;
    referralCode: string;
}

export interface ApiResult {
    status: number;
    type: string;
    message: any;
}
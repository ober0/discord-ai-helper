export interface Action {
    user: {
        username: string;
        id: string;
    },
    data: {
        req: string
        res: string
    },
    aiCalls: number,
    time: number
}
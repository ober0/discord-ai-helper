import { TokenUsage } from "./usage";

export interface CallProcess {
    text: string;
    usage: TokenUsage,
    messageCount: {
        total: number;
        ai: number
        tools: number
    };
    time: number;
}
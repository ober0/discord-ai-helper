import { ChatOpenAI } from "@langchain/openai"
import './graph'
import { getChannelsInfoTool } from "./tools/get-chanells";
import { AI_MODELS } from "../consts";


export const tools = [getChannelsInfoTool]

export const llm = new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com"
    },
    model: AI_MODELS,
}).bindTools(tools)
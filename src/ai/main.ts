import { ChatOpenAI } from "@langchain/openai"
import './graph'
import { AI_MODELS } from "../consts";
import { findChannelsTool } from "./tools/find-chanells";
import { findRoleTool } from "./tools/find-role";
import { findUserTool } from "./tools/find-user";


export const tools = [findChannelsTool, findRoleTool, findUserTool]

export const llm = new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com"
    },
    model: AI_MODELS,
}).bindTools(tools)
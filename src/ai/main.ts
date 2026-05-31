import { ChatOpenAI } from "@langchain/openai"
import './graph'
import { AI_MODELS } from "../consts";
import { findChannelsTool } from "./tools/find-chanells";
import { findRoleTool } from "./tools/find-role";
import { findUserTool } from "./tools/find-user";
import { moveUserTool } from "./tools/move-user";


export const tools = [findChannelsTool, findRoleTool, findUserTool, moveUserTool]

export const llm = new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com"
    },
    model: AI_MODELS,
}).bindTools(tools)
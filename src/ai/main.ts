import { ChatOpenAI } from "@langchain/openai"
import './graph'
import { AI_MODELS } from "../consts";
import { findChannelsTool } from "./tools/find-chanells";
import { findRoleTool } from "./tools/find-role";
import { findUserTool } from "./tools/find-user";
import { moveUserTool } from "./tools/move-user";
import { moveAllUsersTool } from "./tools/move-all-user";
import { createChannelTool } from "./tools/create-channel";
import { deleteChannelTool } from "./tools/delete-channel";
import { editeChannelTool } from "./tools/edite-channel";
import { deleteRoleTool } from "./tools/delete-role";
import { addRoleTool } from "./tools/add-role";
import { muteUserTool } from "./tools/mute-user";
import { unmuteUserTool } from "./tools/unmute-user";


export const tools = [findChannelsTool, findRoleTool, findUserTool, moveUserTool, moveAllUsersTool,createChannelTool, deleteChannelTool, editeChannelTool, deleteRoleTool, addRoleTool, muteUserTool, unmuteUserTool]

export const llm = new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com"
    },
    model: AI_MODELS,
}).bindTools(tools)
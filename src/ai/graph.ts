import { StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph";
import { llm, tools } from "./main";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode(tools);

export const graph = new StateGraph(MessagesAnnotation)
    .addNode("llm", async (state) => {
        const response = await llm.invoke(state.messages);

        return {
            messages: [response]
        };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "llm")
    .addEdge('tools', "llm")
    .addConditionalEdges('llm', (state) => {
        const last = state.messages.at(-1)

        // @ts-ignore
        return last?.tool_calls?.length ? "tools" : END
    })
    .compile()

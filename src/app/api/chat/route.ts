import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { messages, model = "gpt-4o" } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response("Invalid messages format", { status: 400 });
        }

        // Sports analysis system prompt
        const systemPrompt = `You are an expert sports analyst and tipster assistant for Tipster Arena. You provide:

- Detailed match analysis and predictions
- Player performance insights and statistics
- Team tactics and strategic breakdowns
- Injury updates and their impact on games
- Transfer news and rumors analysis
- Historical head-to-head data
- Form analysis and trends
- Betting insights and value picks

Always be:
- Data-driven and analytical
- Honest about uncertainty
- Focused on sports betting and analysis
- Professional but engaging
- Up-to-date with current sports knowledge

Format your responses with clear sections, bullet points, and relevant statistics. Use emojis sparingly but effectively to highlight key points.`;

        let result;

        if (model.startsWith("gpt")) {
            result = await streamText({
                model: openai(model),
                messages: convertToCoreMessages(messages),
                system: systemPrompt,
                temperature: 0.7,
                maxTokens: 2000,
            });
        } else if (model.startsWith("claude")) {
            result = await streamText({
                model: anthropic(model),
                messages: convertToCoreMessages(messages),
                system: systemPrompt,
                temperature: 0.7,
                maxTokens: 2000,
            });
        } else {
            return new Response("Unsupported model", { status: 400 });
        }

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Chat API error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

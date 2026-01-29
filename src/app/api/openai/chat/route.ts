import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { verifyFirebaseToken } from "@/lib/api-auth";

export const runtime = "edge";

export async function POST(req: Request) {
  const user = await verifyFirebaseToken(req);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return new Response("Invalid messages format", { status: 400 });
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    system: "You are a helpful AI assistant",
  });

  return result.toDataStreamResponse();
}

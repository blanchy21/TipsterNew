import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { verifyFirebaseToken } from "@/lib/api-auth";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`openai-chat:${ip}`, 20, 60_000);
  if (!rl.success) return rateLimitResponse(rl);

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

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import { verifyFirebaseToken } from "@/lib/api-auth";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB limit

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`transcribe:${ip}`, 10, 60_000);
  if (!rl.success) return rateLimitResponse(rl);

  const user = await verifyFirebaseToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  const body = await req.json();
  const base64Audio = body.audio;

  if (!base64Audio || typeof base64Audio !== 'string') {
    return NextResponse.json({ error: 'Missing audio data' }, { status: 400 });
  }

  const audio = Buffer.from(base64Audio, "base64");

  if (audio.length > MAX_AUDIO_SIZE) {
    return NextResponse.json({ error: 'Audio file too large' }, { status: 413 });
  }

  // Use a unique temp file to avoid race conditions
  const filePath = path.join(os.tmpdir(), `transcribe-${randomUUID()}.wav`);

  try {
    fs.writeFileSync(filePath, Uint8Array.from(audio));
    const readStream = fs.createReadStream(filePath);

    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  } finally {
    // Always clean up the temp file
    try { fs.unlinkSync(filePath); } catch {}
  }
}

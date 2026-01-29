import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    // API key must not be exposed to unauthenticated callers.
    // Deepgram requests should be proxied server-side instead.
    return NextResponse.json(
      { error: "This endpoint has been disabled for security reasons." },
      { status: 403 }
    );
}

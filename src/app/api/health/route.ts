import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Basic health check
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        };

        // Check if we're in production
        if (process.env.NODE_ENV === 'production') {
            // Add additional production-specific checks
            const productionChecks = {
                firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                openai: !!process.env.OPENAI_API_KEY,
                anthropic: !!process.env.ANTHROPIC_API_KEY,
                replicate: !!process.env.REPLICATE_API_TOKEN,
                deepgram: !!process.env.DEEPGRAM_API_KEY,
            };

            return NextResponse.json({
                ...healthCheck,
                checks: productionChecks,
            });
        }

        return NextResponse.json(healthCheck);
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

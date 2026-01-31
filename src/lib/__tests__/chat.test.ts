import { POST } from '../../app/api/chat/route';

// Mock the auth module to allow requests through
jest.mock('@/lib/api-auth', () => ({
  verifyFirebaseToken: jest.fn(() =>
    Promise.resolve({ uid: 'test-user', email: 'test@example.com' })
  ),
}));

// Mock rate limiting to allow requests through
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(() => ({ success: true })),
  rateLimitResponse: jest.fn(),
  getClientIp: jest.fn(() => '127.0.0.1'),
}));

// Mock the AI SDK
jest.mock('ai', () => ({
  streamText: jest.fn(() =>
    Promise.resolve({
      toDataStreamResponse: jest.fn(() => new Response('streamed data')),
    })
  ),
  convertToCoreMessages: jest.fn((messages) => messages),
}));

jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn((model) => ({ model, provider: 'openai' })),
}));

jest.mock('@ai-sdk/anthropic', () => ({
  anthropic: jest.fn((model) => ({ model, provider: 'anthropic' })),
}));

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle POST request successfully', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, world!' }],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it('should handle invalid request body', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should handle missing messages', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle different message types', async () => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'How are you?' },
    ];

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it('should handle large message arrays', async () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it('should handle errors gracefully', async () => {
    const { streamText } = require('ai');
    streamText.mockRejectedValueOnce(new Error('AI service error'));

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello!' }],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should return 401 for unauthenticated requests', async () => {
    const { verifyFirebaseToken } = require('@/lib/api-auth');
    verifyFirebaseToken.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello!' }],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});

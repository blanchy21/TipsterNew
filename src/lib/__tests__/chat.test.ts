// Mock NextRequest for testing
global.Request = class MockRequest {
    public url: string
    public method: string
    public headers: Headers
    public body: any
    public cache: RequestCache = 'default'
    public credentials: RequestCredentials = 'same-origin'
    public destination: RequestDestination = 'document'
    public integrity: string = ''
    public keepalive: boolean = false
    public mode: RequestMode = 'cors'
    public redirect: RequestRedirect = 'follow'
    public referrer: string = ''
    public referrerPolicy: ReferrerPolicy = 'strict-origin-when-cross-origin'
    public signal: AbortSignal = new AbortController().signal

    constructor(public input: RequestInfo | URL, public init: RequestInit = {}) {
        this.url = typeof input === 'string' ? input : input.toString()
        this.method = init.method || 'GET'
        this.headers = new Headers(init.headers)
        this.body = init.body
    }

    async json() {
        return Promise.resolve(JSON.parse(this.body || '{}'))
    }

    async text() {
        return Promise.resolve(this.body || '')
    }

    async arrayBuffer() {
        return Promise.resolve(new ArrayBuffer(0))
    }

    async blob() {
        return Promise.resolve(new Blob())
    }

    async formData() {
        return Promise.resolve(new FormData())
    }

    clone() {
        return new MockRequest(this.input, this.init)
    }
} as any

import { POST } from '../../app/api/chat/route'

// Mock the AI SDK
jest.mock('ai', () => ({
    streamText: jest.fn(),
}))

// Mock the OpenAI SDK
jest.mock('openai', () => ({
    OpenAI: jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn(),
            },
        },
    })),
}))

describe('/api/chat', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Reset environment variables
        process.env.OPENAI_API_KEY = 'test-api-key'
    })

    afterEach(() => {
        delete process.env.OPENAI_API_KEY
    })

    it('should handle POST request successfully', async () => {
        const { streamText } = require('ai')
        const mockStream = {
            toDataStreamResponse: jest.fn().mockReturnValue(new Response('streamed data')),
        }
        streamText.mockResolvedValue(mockStream)

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello, world!' }],
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }) as any

        const response = await POST(request)

        expect(response).toBeInstanceOf(Response)
        expect(streamText).toHaveBeenCalledWith({
            model: expect.any(Object),
            messages: [{ role: 'user', content: 'Hello, world!' }],
            maxTokens: 1000,
            temperature: 0.7,
        })
    })

    it('should handle missing API key', async () => {
        delete process.env.OPENAI_API_KEY

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello, world!' }],
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }) as any

        const response = await POST(request)

        expect(response.status).toBe(500)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('OpenAI API key not configured')
    })

    it('should handle invalid request body', async () => {
        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: 'invalid json',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('Invalid request body')
    })

    it('should handle missing messages', async () => {
        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await POST(request)

        expect(response.status).toBe(400)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('Messages are required')
    })

    it('should handle AI service errors', async () => {
        const { streamText } = require('ai')
        streamText.mockRejectedValue(new Error('AI service error'))

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello, world!' }],
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }) as any

        const response = await POST(request)

        expect(response.status).toBe(500)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('Failed to generate response')
    })

    it('should handle different message types', async () => {
        const { streamText } = require('ai')
        const mockStream = {
            toDataStreamResponse: jest.fn().mockReturnValue(new Response('streamed data')),
        }
        streamText.mockResolvedValue(mockStream)

        const messages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello!' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' },
        ]

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await POST(request)

        expect(response).toBeInstanceOf(Response)
        expect(streamText).toHaveBeenCalledWith({
            model: expect.any(Object),
            messages,
            maxTokens: 1000,
            temperature: 0.7,
        })
    })

    it('should handle large message arrays', async () => {
        const { streamText } = require('ai')
        const mockStream = {
            toDataStreamResponse: jest.fn().mockReturnValue(new Response('streamed data')),
        }
        streamText.mockResolvedValue(mockStream)

        const messages = Array.from({ length: 100 }, (_, i) => ({
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: `Message ${i}`,
        }))

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await POST(request)

        expect(response).toBeInstanceOf(Response)
        expect(streamText).toHaveBeenCalledWith({
            model: expect.any(Object),
            messages,
            maxTokens: 1000,
            temperature: 0.7,
        })
    })

    it('should handle rate limiting', async () => {
        const { streamText } = require('ai')
        const rateLimitError = new Error('Rate limit exceeded')
        rateLimitError.name = 'RateLimitError'
        streamText.mockRejectedValue(rateLimitError)

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello, world!' }],
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }) as any

        const response = await POST(request)

        expect(response.status).toBe(429)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('Rate limit exceeded')
    })

    it('should handle timeout errors', async () => {
        const { streamText } = require('ai')
        const timeoutError = new Error('Request timeout')
        timeoutError.name = 'TimeoutError'
        streamText.mockRejectedValue(timeoutError)

        const request = new Request('http://localhost:3000/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello, world!' }],
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }) as any

        const response = await POST(request)

        expect(response.status).toBe(408)
        const responseBody = await response.json()
        expect(responseBody.error).toContain('Request timeout')
    })
})

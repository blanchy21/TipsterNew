import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder in Node.js environment
if (!global.TextEncoder) {
    const { TextEncoder, TextDecoder } = require('util')
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder
}

// Polyfill for ReadableStream in Node.js environment
if (!global.ReadableStream) {
    const { ReadableStream } = require('stream/web')
    global.ReadableStream = ReadableStream
}

// Polyfill for TransformStream in Node.js environment
if (!global.TransformStream) {
    const { TransformStream } = require('stream/web')
    global.TransformStream = TransformStream
}

// Simple Response polyfill for Node.js environment
if (!global.Response) {
    global.Response = class Response {
        constructor(body, init = {}) {
            this.body = body
            this.status = init.status || 200
            this.statusText = init.statusText || 'OK'
            this.headers = new Map(Object.entries(init.headers || {}))
        }

        async json() {
            if (typeof this.body === 'string') {
                return JSON.parse(this.body)
            }
            return this.body
        }

        async text() {
            return this.body
        }

        static json(data, init = {}) {
            return new Response(JSON.stringify(data), {
                ...init,
                headers: {
                    'Content-Type': 'application/json',
                    ...init.headers
                }
            })
        }
    }
}

// Simple Headers polyfill for Node.js environment
if (!global.Headers) {
    global.Headers = class Headers {
        constructor(init = {}) {
            this.headers = new Map()
            if (Array.isArray(init)) {
                init.forEach(([key, value]) => this.headers.set(key, value))
            } else if (init) {
                Object.entries(init).forEach(([key, value]) => this.headers.set(key, value))
            }
        }

        get(name) {
            return this.headers.get(name.toLowerCase())
        }

        set(name, value) {
            this.headers.set(name.toLowerCase(), value)
        }

        has(name) {
            return this.headers.has(name.toLowerCase())
        }

        delete(name) {
            this.headers.delete(name.toLowerCase())
        }

        entries() {
            return this.headers.entries()
        }

        keys() {
            return this.headers.keys()
        }

        values() {
            return this.headers.values()
        }

        forEach(callback) {
            this.headers.forEach(callback)
        }
    }
}

// Simple Request polyfill for Node.js environment
if (!global.Request) {
    global.Request = class Request {
        constructor(input, init = {}) {
            this.url = typeof input === 'string' ? input : input.toString()
            this.method = init.method || 'GET'
            this.headers = new Headers(init.headers || {})
            this.body = init.body
            this.cache = init.cache || 'default'
            this.credentials = init.credentials || 'same-origin'
            this.mode = init.mode || 'cors'
            this.redirect = init.redirect || 'follow'
            this.referrer = init.referrer || ''
            this.signal = init.signal || new AbortController().signal
        }

        async json() {
            if (typeof this.body === 'string') {
                return JSON.parse(this.body)
            }
            return this.body
        }

        async text() {
            return this.body
        }

        async arrayBuffer() {
            return new ArrayBuffer(0)
        }

        async blob() {
            return new Blob()
        }

        async formData() {
            return new FormData()
        }

        clone() {
            return new Request(this.url, {
                method: this.method,
                headers: this.headers,
                body: this.body
            })
        }
    }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock Firebase
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}))

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
        currentUser: null,
        onAuthStateChanged: jest.fn(),
        signInWithPopup: jest.fn(),
        signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(() => Promise.resolve({
        user: {
            uid: 'test-uid',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
        }
    })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({
        user: {
            uid: 'test-uid',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
        }
    })),
    updateProfile: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    onSnapshot: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    serverTimestamp: jest.fn(() => new Date()),
}))

jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}))

// Mock Firebase utils
jest.mock('@/lib/firebase/firebaseUtils', () => ({
    createUserProfile: jest.fn(() => Promise.resolve()),
    getUserProfile: jest.fn(() => Promise.resolve(null)),
    updateUserProfile: jest.fn(() => Promise.resolve()),
    createPost: jest.fn(() => Promise.resolve()),
    likePost: jest.fn(() => Promise.resolve()),
    unlikePost: jest.fn(() => Promise.resolve()),
    incrementPostViews: jest.fn(() => Promise.resolve()),
    togglePostLike: jest.fn(() => Promise.resolve()),
}))

// Mock AI SDK
jest.mock('ai', () => ({
    streamText: jest.fn(() => Promise.resolve({
        toDataStreamResponse: jest.fn(() => new Response('streamed data'))
    })),
    convertToCoreMessages: jest.fn((messages) => messages),
}))

jest.mock('@ai-sdk/openai', () => ({
    openai: jest.fn((model) => ({ model, provider: 'openai' })),
}))

jest.mock('@ai-sdk/anthropic', () => ({
    anthropic: jest.fn((model) => ({ model, provider: 'anthropic' })),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: 'div',
        button: 'button',
        span: 'span',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        p: 'p',
        img: 'img',
        nav: 'nav',
        section: 'section',
        article: 'article',
        header: 'header',
        footer: 'footer',
        main: 'main',
        aside: 'aside',
        ul: 'ul',
        li: 'li',
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
        start: jest.fn(),
        stop: jest.fn(),
        set: jest.fn(),
    }),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
}

// Mock performance
Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn(() => []),
        getEntriesByName: jest.fn(() => []),
    },
})

// Suppress console errors in tests unless explicitly needed
// eslint-disable-next-line no-console
const originalError = console.error
beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = originalError
})

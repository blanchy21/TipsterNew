/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://tipster-arena.vercel.app',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: [
        '/admin',
        '/admin/*',
        '/debug',
        '/debug/*',
        '/mobile-debug',
        '/mobile-debug/*',
        '/test',
        '/test/*',
        '/api/*',
        '/_next/*',
        '/favicon.ico',
        '/robots.txt',
        '/sitemap.xml'
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/*',
                    '/debug',
                    '/debug/*',
                    '/mobile-debug',
                    '/mobile-debug/*',
                    '/test',
                    '/test/*',
                    '/api',
                    '/api/*',
                    '/_next',
                    '/_next/*'
                ]
            }
        ],
        additionalSitemaps: [
            'https://tipster-arena.vercel.app/sitemap.xml'
        ]
    },
    transform: async (config, path) => {
        // Custom transform for different page types
        const customPaths = {
            '/': {
                priority: 1.0,
                changefreq: 'daily'
            },
            '/profile': {
                priority: 0.8,
                changefreq: 'weekly'
            },
            '/following': {
                priority: 0.7,
                changefreq: 'weekly'
            },
            '/chat': {
                priority: 0.6,
                changefreq: 'weekly'
            },
            '/privacy': {
                priority: 0.3,
                changefreq: 'monthly'
            },
            '/terms': {
                priority: 0.3,
                changefreq: 'monthly'
            }
        };

        return {
            loc: path,
            changefreq: customPaths[path]?.changefreq || 'weekly',
            priority: customPaths[path]?.priority || 0.5,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
    }
};

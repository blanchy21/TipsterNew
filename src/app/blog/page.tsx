import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Tipster Arena | Sports Betting Tips & Guides',
  description: 'Expert guides on sports betting, tipster verification, and building a winning track record. Free resources for serious sports bettors.',
  openGraph: {
    title: 'Blog - Tipster Arena | Sports Betting Tips & Guides',
    description: 'Expert guides on sports betting, tipster verification, and building a winning track record.',
    url: 'https://tipster-arena.com/blog',
    type: 'website',
  },
};

const blogPosts = [
  {
    slug: 'how-to-verify-tipster-track-record',
    title: 'How to Verify a Sports Tipster\'s Track Record (Complete 2026 Guide)',
    excerpt: 'Learn the essential steps to verify if a tipster is legitimate. Avoid scams and find tipsters with proven, transparent records.',
    date: '2026-01-30',
    readTime: '8 min read',
    category: 'Guides',
  },
  // Add more posts here as you create them
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-amber-500 hover:text-amber-400 mb-4 inline-block">
            ← Back to Tipster Arena
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Tipster Arena Blog
          </h1>
          <p className="text-xl text-slate-300">
            Expert guides on sports betting, tipster verification, and building a winning track record.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold text-white hover:text-amber-400 transition-colors mb-3">
                  {post.title}
                </h2>
              </Link>
              <p className="text-slate-300 mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-8 border border-amber-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Start Your Tipster Journey?
          </h2>
          <p className="text-slate-300 mb-6">
            Join Tipster Arena for free and build your verified track record.
          </p>
          <Link
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}

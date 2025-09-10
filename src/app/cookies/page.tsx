'use client';

import React from 'react';
import Link from 'next/link';

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-[#0A0A14] text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A14] via-[#1a0d2e] to-[#0A0A14]"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-4 rounded-full border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                        <div className="flex items-center justify-between px-4 py-3">
                            <Link href="/" className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center ring-1 ring-white/20 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    </svg>
                                </span>
                                <span className="text-[17px] font-medium tracking-tight">Tipster Arena</span>
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 px-4 py-2 text-sm font-medium tracking-tight text-white shadow-[0_8px_30px_rgba(245,158,11,0.35)] ring-1 ring-white/10 hover:from-amber-500 hover:to-orange-500 transition-all duration-200 hover:shadow-[0_12px_40px_rgba(245,158,11,0.45)]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Cookie Policy
                    </h1>

                    <p className="text-lg text-white/70 mb-8">
                        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">What Are Cookies?</h2>
                            <p className="text-white/70 leading-relaxed">
                                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Cookies</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Tipster Arena uses cookies for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li>Essential functionality (authentication, security)</li>
                                <li>Performance monitoring and analytics</li>
                                <li>User preferences and settings</li>
                                <li>Improving our services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Types of Cookies We Use</h2>

                            <div className="space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-emerald-400">Essential Cookies</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        These cookies are necessary for the website to function properly. They cannot be disabled and are set in response to actions made by you.
                                    </p>
                                    <div className="text-sm text-white/60">
                                        <strong>Examples:</strong> Authentication tokens, security settings, user session data
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Analytics Cookies</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                    </p>
                                    <div className="text-sm text-white/60">
                                        <strong>Examples:</strong> Page views, time spent on site, error tracking
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-cyan-400">Preference Cookies</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        These cookies remember your choices and preferences to provide a more personalized experience.
                                    </p>
                                    <div className="text-sm text-white/60">
                                        <strong>Examples:</strong> Theme preferences, language settings, notification preferences
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights Under GDPR</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                As a European user, you have the following rights regarding cookies and your personal data:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Right to be informed:</strong> We provide clear information about our cookie usage</li>
                                <li><strong>Right of access:</strong> You can request information about what cookies we use</li>
                                <li><strong>Right to rectification:</strong> You can update your cookie preferences at any time</li>
                                <li><strong>Right to erasure:</strong> You can delete cookies from your browser</li>
                                <li><strong>Right to restrict processing:</strong> You can disable non-essential cookies</li>
                                <li><strong>Right to data portability:</strong> You can export your data</li>
                                <li><strong>Right to object:</strong> You can opt-out of certain cookie usage</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Managing Your Cookie Preferences</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                You can control and manage cookies in several ways:
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Browser Settings</h3>
                                    <p className="text-white/70 text-sm">
                                        Most browsers allow you to refuse or accept cookies. You can usually find these settings in the Options or Preferences menu of your browser.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Cookie Consent Banner</h3>
                                    <p className="text-white/70 text-sm">
                                        When you first visit our site, you'll see a cookie consent banner where you can choose which types of cookies to accept.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Account Settings</h3>
                                    <p className="text-white/70 text-sm">
                                        If you have an account, you can manage your privacy preferences in your account settings.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Cookies</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We may use third-party services that set their own cookies. These include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Firebase:</strong> For authentication and database services</li>
                                <li><strong>Analytics providers:</strong> For website performance monitoring</li>
                                <li><strong>Content delivery networks:</strong> For faster content loading</li>
                            </ul>
                            <p className="text-white/70 leading-relaxed mt-4">
                                These third parties have their own privacy policies and cookie practices. We recommend reviewing their policies for more information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Data Retention</h2>
                            <p className="text-white/70 leading-relaxed">
                                We retain cookie data only for as long as necessary to fulfill the purposes outlined in this policy. Essential cookies are typically retained for the duration of your session, while analytics cookies may be retained for up to 24 months.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Updates to This Policy</h2>
                            <p className="text-white/70 leading-relaxed">
                                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-white/70">
                                    <strong>Email:</strong> tipsterarena2025@gmail.com<br />
                                    <strong>Response Time:</strong> We aim to respond within 48 hours<br />
                                    <strong>Data Protection:</strong> All inquiries handled by our privacy team
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-white/60 text-sm">
                                This policy complies with GDPR, ePrivacy Directive, and other applicable European data protection laws.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/privacy" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

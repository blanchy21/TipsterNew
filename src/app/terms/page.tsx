'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
                        Terms of Service
                    </h1>

                    <p className="text-lg text-white/70 mb-8">
                        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                            <p className="text-white/70 leading-relaxed">
                                By accessing and using Tipster Arena (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Tipster Arena is a free platform that allows users to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li>Share sports tips and predictions</li>
                                <li>Track their tip performance and statistics</li>
                                <li>Follow other tipsters and build a community</li>
                                <li>View transparent performance data</li>
                                <li>Engage in sports-focused discussions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
                            <div className="space-y-4">
                                <p className="text-white/70 leading-relaxed">
                                    To use certain features of the Service, you must register for an account. You agree to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and update your account information</li>
                                    <li>Keep your password secure and confidential</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized use</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. User Conduct</h2>
                            <div className="space-y-4">
                                <p className="text-white/70 leading-relaxed">
                                    You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                    <li>Post false, misleading, or fraudulent information</li>
                                    <li>Harass, abuse, or harm other users</li>
                                    <li>Post content that is illegal, harmful, or offensive</li>
                                    <li>Spam or post repetitive content</li>
                                    <li>Attempt to gain unauthorized access to the Service</li>
                                    <li>Use automated systems to access the Service</li>
                                    <li>Violate any applicable laws or regulations</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Content and Intellectual Property</h2>
                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Your Content</h3>
                                    <p className="text-white/70 text-sm">
                                        You retain ownership of content you post, but grant us a license to use, display, and distribute it through the Service.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Our Content</h3>
                                    <p className="text-white/70 text-sm">
                                        The Service and its original content, features, and functionality are owned by Tipster Arena and are protected by international copyright, trademark, and other intellectual property laws.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Prohibited Content</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                The following types of content are strictly prohibited:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li>Political content or discussions</li>
                                <li>Religious content or discussions</li>
                                <li>Adult or inappropriate content</li>
                                <li>Hate speech or discriminatory content</li>
                                <li>Violence or threatening content</li>
                                <li>Spam or promotional content</li>
                                <li>Personal information of others</li>
                                <li>Copyrighted material without permission</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Disclaimers and Limitations</h2>
                            <div className="space-y-4">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">Important Notice</h3>
                                    <p className="text-white/70 text-sm">
                                        <strong>Tipster Arena is for entertainment purposes only.</strong> We do not provide financial advice, and all tips shared are opinions, not guarantees. Sports betting involves risk, and you should never bet more than you can afford to lose.
                                    </p>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    The Service is provided &quot;as is&quot; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Privacy and Data Protection</h2>
                            <p className="text-white/70 leading-relaxed">
                                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We comply with applicable data protection laws, including GDPR for European users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Termination</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.
                            </p>
                            <p className="text-white/70 leading-relaxed">
                                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. Modifications to Terms</h2>
                            <p className="text-white/70 leading-relaxed">
                                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">11. Governing Law</h2>
                            <p className="text-white/70 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">12. Contact Information</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-white/70">
                                    <strong>Email:</strong> tipsterarena2025@gmail.com<br />
                                    <strong>Website:</strong> tipsterarena.com<br />
                                    <strong>Response Time:</strong> We aim to respond within 48 hours
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">13. Severability</h2>
                            <p className="text-white/70 leading-relaxed">
                                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">14. Entire Agreement</h2>
                            <p className="text-white/70 leading-relaxed">
                                These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Tipster Arena regarding the use of the Service.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-white/60 text-sm">
                                By using Tipster Arena, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/privacy" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/cookies" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

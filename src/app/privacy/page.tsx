'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>

                    <p className="text-lg text-white/70 mb-8">
                        Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Tipster Arena ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                            </p>
                            <p className="text-white/70 leading-relaxed">
                                By using Tipster Arena, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>

                            <div className="space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-amber-400">Personal Information</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        We may collect personal information that you voluntarily provide to us when you:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                                        <li>Create an account (email address, username, display name)</li>
                                        <li>Update your profile (bio, profile picture, preferences)</li>
                                        <li>Post tips and comments (content you choose to share)</li>
                                        <li>Contact us (name, email, message content)</li>
                                    </ul>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-orange-400">Usage Information</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        We automatically collect certain information about your use of our service:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                                        <li>Device information (browser type, operating system)</li>
                                        <li>Usage patterns (pages visited, time spent, features used)</li>
                                        <li>IP address and general location data</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-yellow-400">Third-Party Information</h3>
                                    <p className="text-white/70 leading-relaxed mb-3">
                                        We may receive information from third-party services:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                                        <li>Firebase (authentication and database services)</li>
                                        <li>Analytics providers (usage statistics)</li>
                                        <li>Social media platforms (if you choose to connect accounts)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We use the information we collect for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Service Provision:</strong> To provide, maintain, and improve our services</li>
                                <li><strong>Account Management:</strong> To create and manage your user account</li>
                                <li><strong>Content Display:</strong> To display your tips, comments, and profile information</li>
                                <li><strong>Communication:</strong> To send you important updates and respond to inquiries</li>
                                <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
                                <li><strong>Security:</strong> To protect against fraud, abuse, and security threats</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">4. Information Sharing and Disclosure</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Public Content:</strong> Tips and comments you post are visible to other users</li>
                                <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our platform</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>Consent:</strong> When you have given explicit consent to share information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Security</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication measures</li>
                                <li>Secure data storage and backup procedures</li>
                                <li>Staff training on data protection practices</li>
                            </ul>
                            <p className="text-white/70 leading-relaxed mt-4">
                                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights (GDPR Compliance)</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                If you are a resident of the European Economic Area (EEA), you have the following rights:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-amber-400">Access & Portability</h3>
                                    <p className="text-white/70 text-sm">Request a copy of your personal data and data portability</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-orange-400">Rectification</h3>
                                    <p className="text-white/70 text-sm">Correct inaccurate or incomplete personal data</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">Erasure</h3>
                                    <p className="text-white/70 text-sm">Request deletion of your personal data</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-amber-400">Restriction</h3>
                                    <p className="text-white/70 text-sm">Limit how we process your personal data</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-orange-400">Objection</h3>
                                    <p className="text-white/70 text-sm">Object to processing of your personal data</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">Withdraw Consent</h3>
                                    <p className="text-white/70 text-sm">Withdraw consent for data processing</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">7. Data Retention</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Account Data:</strong> Until you delete your account or request deletion</li>
                                <li><strong>Usage Data:</strong> Up to 24 months for analytics purposes</li>
                                <li><strong>Legal Requirements:</strong> As required by applicable law</li>
                                <li><strong>Security:</strong> As necessary to protect against fraud and abuse</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies and Tracking Technologies</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                We use cookies and similar technologies to enhance your experience. For detailed information about our cookie practices, please see our <Link href="/cookies" className="text-amber-400 hover:text-amber-300 transition-colors">Cookie Policy</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">9. Third-Party Services</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Our service integrates with third-party services that have their own privacy policies:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                                <li><strong>Firebase:</strong> For authentication and database services (Google's Privacy Policy applies)</li>
                                <li><strong>Analytics Providers:</strong> For usage statistics and performance monitoring</li>
                                <li><strong>Content Delivery Networks:</strong> For faster content loading</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">10. International Data Transfers</h2>
                            <p className="text-white/70 leading-relaxed">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws, including standard contractual clauses and adequacy decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">11. Children's Privacy</h2>
                            <p className="text-white/70 leading-relaxed">
                                Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">12. Changes to This Privacy Policy</h2>
                            <p className="text-white/70 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">13. Contact Us</h2>
                            <p className="text-white/70 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-white/70">
                                    <strong>Email:</strong> tipsterarena2025@gmail.com<br />
                                    <strong>Response Time:</strong> We aim to respond within 48 hours<br />
                                    <strong>Data Protection Officer:</strong> Available upon request
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-white">14. Supervisory Authority</h2>
                            <p className="text-white/70 leading-relaxed">
                                If you are a resident of the EEA and believe we have not addressed your concerns, you have the right to lodge a complaint with your local data protection supervisory authority.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-white/60 text-sm">
                                This policy complies with GDPR, CCPA, and other applicable data protection laws.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/terms" className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
                                    Terms of Service
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

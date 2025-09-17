'use client';

import React, { useState, useEffect } from 'react';
import { testMobileFirebaseConnectivity, getMobileFirebaseFallback } from '@/lib/firebase/firebase-mobile-debug';

interface TopTipstersMobileDebugProps {
    onNavigateToProfile?: (userId: string) => void;
}

const TopTipstersMobileDebug: React.FC<TopTipstersMobileDebugProps> = ({ onNavigateToProfile }) => {
    const [debugResults, setDebugResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const runDebugTests = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('[Mobile Debug] Starting comprehensive Firebase tests...');

                // Test 1: Basic connectivity
                const connectivityResults = await testMobileFirebaseConnectivity();

                // Test 2: Fallback method
                const fallbackResults = await getMobileFirebaseFallback();

                const results = {
                    connectivity: connectivityResults,
                    fallback: fallbackResults ? 'Success' : 'Failed',
                    timestamp: new Date().toISOString(),
                    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
                    isMobile: typeof window !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false
                };

                setDebugResults(results);
                console.log('[Mobile Debug] All tests completed:', results);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(errorMessage);
                console.error('[Mobile Debug] Test failed:', errorMessage);
            } finally {
                setLoading(false);
            }
        };

        runDebugTests();
    }, []);

    if (loading) {
        return (
            <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-full p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Mobile Firebase Debug</h1>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Running Firebase connectivity tests...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-full p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8 text-red-400">Mobile Firebase Debug - Error</h1>
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-400">Error Details:</h2>
                        <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-full p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Mobile Firebase Debug Results</h1>

                {debugResults && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Device Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400">Is Mobile:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-sm ${debugResults.isMobile ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {debugResults.isMobile ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">User Agent:</span>
                                    <span className="ml-2 text-sm text-gray-300">{debugResults.userAgent}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Test Time:</span>
                                    <span className="ml-2 text-sm text-gray-300">{new Date(debugResults.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Connectivity Results */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Firebase Connectivity</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Firestore:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${debugResults.connectivity.firestore ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {debugResults.connectivity.firestore ? 'Connected' : 'Failed'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Firestore Functions:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${debugResults.connectivity.firestoreFunctions ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {debugResults.connectivity.firestoreFunctions ? 'Loaded' : 'Failed'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Auth:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${debugResults.connectivity.auth ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {debugResults.connectivity.auth ? 'Connected' : 'Failed'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Auth Functions:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${debugResults.connectivity.authFunctions ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {debugResults.connectivity.authFunctions ? 'Loaded' : 'Failed'}
                                    </span>
                                </div>
                            </div>

                            {debugResults.connectivity.errors.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-red-400 mb-2">Errors:</h3>
                                    <ul className="space-y-1">
                                        {debugResults.connectivity.errors.map((error: string, index: number) => (
                                            <li key={index} className="text-red-300 text-sm">• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Fallback Results */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Fallback Method</h2>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Synchronous Import Fallback:</span>
                                <span className={`px-2 py-1 rounded text-sm ${debugResults.fallback === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {debugResults.fallback}
                                </span>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-blue-900/20 border border-blue-500/50 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 text-blue-400">Recommendations</h2>
                            <ul className="space-y-2 text-gray-300">
                                {!debugResults.connectivity.firestore && (
                                    <li>• Firestore connection failed - check Firebase configuration</li>
                                )}
                                {!debugResults.connectivity.firestoreFunctions && (
                                    <li>• Firestore functions failed to load - dynamic imports may be problematic on mobile</li>
                                )}
                                {debugResults.fallback === 'Success' && (
                                    <li>• Consider using synchronous imports for mobile devices</li>
                                )}
                                {debugResults.isMobile && (
                                    <li>• Mobile device detected - consider implementing mobile-specific optimizations</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopTipstersMobileDebug;

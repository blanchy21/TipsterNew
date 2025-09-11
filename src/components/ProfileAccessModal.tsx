'use client';

import React, { useState } from 'react';
import { User, LogIn, X, AlertCircle } from 'lucide-react';

interface ProfileAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    onSignup: () => void;
}

export default function ProfileAccessModal({ isOpen, onClose, onLogin, onSignup }: ProfileAccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Profile Access</h2>
                            <p className="text-sm text-slate-400">Sign in to access your profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-400" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-white mb-2">Profile Access Required</h3>
                            <p className="text-slate-400 text-sm">
                                You need to be signed in to access your profile and manage your account settings.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => {
                                    onClose();
                                    onLogin();
                                }}
                                className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    onSignup();
                                }}
                                className="flex-1 px-4 py-3 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-900/50 border-t border-white/10">
                    <p className="text-xs text-slate-500 text-center">
                        Create an account to access all features and manage your profile.
                    </p>
                </div>
            </div>
        </div>
    );
}

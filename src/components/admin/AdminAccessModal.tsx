'use client';

import React from 'react';
import { ShieldX, X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const ADMIN_EMAILS = ['paulblanche@gmail.com', 'admin@tipsterarena.com'];

interface AdminAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function isAdminEmail(email: string | null | undefined): boolean {
    return !!email && ADMIN_EMAILS.includes(email);
}

export default function AdminAccessModal({ isOpen, onClose, onSuccess }: AdminAccessModalProps) {
    const { user } = useAuth();

    // Auto-grant access if the user's email is an admin email
    React.useEffect(() => {
        if (isOpen && user && isAdminEmail(user.email)) {
            onSuccess();
        }
    }, [isOpen, user, onSuccess]);

    if (!isOpen) return null;

    // If user is admin, the effect above will call onSuccess and close the modal.
    // This UI only shows for non-admin users.
    if (user && isAdminEmail(user.email)) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                            <ShieldX className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Access Denied</h2>
                            <p className="text-sm text-slate-400">Admin area restricted</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-300 mb-4">
                        {user
                            ? 'Your account does not have admin privileges. Only authorized admin accounts can access this area.'
                            : 'You must be signed in with an authorized admin account to access this area.'}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                    >
                        Go Back
                    </button>
                </div>

                <div className="px-6 py-4 bg-slate-900/50 border-t border-white/10">
                    <p className="text-xs text-slate-500 text-center">
                        This area is restricted to authorized administrators only.
                    </p>
                </div>
            </div>
        </div>
    );
}

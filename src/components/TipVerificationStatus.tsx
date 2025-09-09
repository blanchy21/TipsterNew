'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Trophy, Shield, Award } from 'lucide-react';
import { TipStatus } from '@/lib/types';

interface TipVerificationStatusProps {
    status: TipStatus;
    verifiedAt?: string;
    verifiedBy?: string;
    showDetails?: boolean;
    className?: string;
}

export default function TipVerificationStatus({
    status,
    verifiedAt,
    verifiedBy,
    showDetails = false,
    className = ''
}: TipVerificationStatusProps) {
    const getStatusConfig = (status: TipStatus) => {
        const configs = {
            pending: {
                icon: Clock,
                label: 'Pending Verification',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/20',
                borderColor: 'border-yellow-500/30',
                iconColor: 'text-yellow-400'
            },
            win: {
                icon: CheckCircle,
                label: 'Verified Win',
                color: 'text-green-400',
                bgColor: 'bg-green-500/20',
                borderColor: 'border-green-500/30',
                iconColor: 'text-green-400'
            },
            loss: {
                icon: XCircle,
                label: 'Verified Loss',
                color: 'text-red-400',
                bgColor: 'bg-red-500/20',
                borderColor: 'border-red-500/30',
                iconColor: 'text-red-400'
            },
            void: {
                icon: AlertCircle,
                label: 'Void',
                color: 'text-gray-400',
                bgColor: 'bg-gray-500/20',
                borderColor: 'border-gray-500/30',
                iconColor: 'text-gray-400'
            },
            place: {
                icon: Trophy,
                label: 'Place',
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/20',
                borderColor: 'border-blue-500/30',
                iconColor: 'text-blue-400'
            }
        };

        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bgColor} ${config.borderColor} ${config.color}`}>
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                <span>{config.label}</span>
                {status !== 'pending' && (
                    <Shield className="w-3 h-3 text-slate-400" />
                )}
            </div>

            {showDetails && verifiedAt && (
                <div className="text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Verified {new Date(verifiedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

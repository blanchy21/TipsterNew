'use client';

import React, { useState } from 'react';
import { X, Calendar, Trophy, Users, Target, Hash, Filter } from 'lucide-react';

interface FilterOptions {
    timeRange: string;
    tipStatus: string;
    engagement: string;
    userType: string;
    oddsRange: string;
    selectedTags: string[];
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '30days', label: 'Last 30 Days' }
];

const tipStatuses = [
    { value: 'all', label: 'All Tips' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'win', label: 'Winning Tips' },
    { value: 'loss', label: 'Losing Tips' },
    { value: 'void', label: 'Void Tips' }
];

const engagementTypes = [
    { value: 'all', label: 'All' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Commented' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'trending', label: 'Trending' }
];

const userTypes = [
    { value: 'all', label: 'All Users' },
    { value: 'verified', label: 'Verified Tipsters' },
    { value: 'following', label: 'Following Only' },
    { value: 'highWinRate', label: 'High Win Rate (>70%)' },
    { value: 'new', label: 'New Tipsters' }
];

const oddsRanges = [
    { value: 'all', label: 'All Odds' },
    { value: 'low', label: 'Low (1.1 - 2.0)' },
    { value: 'medium', label: 'Medium (2.0 - 5.0)' },
    { value: 'high', label: 'High (5.0+)' }
];

const popularTags = [
    'Premier League', 'Champions League', 'NBA', 'NFL', 'MLB', 'NHL',
    'Tennis', 'Golf', 'Boxing', 'MMA', 'Formula 1', 'Cricket'
];

export default function FilterModal({ isOpen, onClose, onApplyFilters, currentFilters }: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);

    const handleFilterChange = (key: keyof FilterOptions, value: string | string[]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            selectedTags: prev.selectedTags.includes(tag)
                ? prev.selectedTags.filter(t => t !== tag)
                : [...prev.selectedTags, tag]
        }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {
            timeRange: 'all',
            tipStatus: 'all',
            engagement: 'all',
            userType: 'all',
            oddsRange: 'all',
            selectedTags: []
        };
        setFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-8 md:pt-16" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl border border-white/10 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col mt-2 sm:mt-4" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-slate-800">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-sky-400" />
                        <h2 className="text-xl font-semibold text-white">Filter Tips</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative">
                    {/* Time Range */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-sky-400" />
                            <h3 className="text-lg font-medium text-white">Time Range</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {timeRanges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => handleFilterChange('timeRange', range.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.timeRange === range.value
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tip Status */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-4 h-4 text-green-400" />
                            <h3 className="text-lg font-medium text-white">Tip Status</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {tipStatuses.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleFilterChange('tipStatus', status.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.tipStatus === status.value
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Engagement */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-4 h-4 text-purple-400" />
                            <h3 className="text-lg font-medium text-white">Engagement</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {engagementTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleFilterChange('engagement', type.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.engagement === type.value
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Type */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-4 h-4 text-orange-400" />
                            <h3 className="text-lg font-medium text-white">User Type</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {userTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleFilterChange('userType', type.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.userType === type.value
                                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Odds Range */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-pink-400" />
                            <h3 className="text-lg font-medium text-white">Odds Range</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {oddsRanges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => handleFilterChange('oddsRange', range.value)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${filters.oddsRange === range.value
                                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Hash className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-lg font-medium text-white">Popular Tags</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {popularTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filters.selectedTags.includes(tag)
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-t border-white/10 bg-slate-800">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        Reset All
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

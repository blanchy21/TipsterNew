'use client';

import React, { useState } from 'react';
import { Database, Trash2, Users, FileText, Loader2 } from 'lucide-react';
import { populateTestData, clearTestData } from '@/lib/populateTestData';

const AdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePopulateData = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await populateTestData();
      if (result.success) {
        setMessage({ type: 'success', text: 'Test data populated successfully! Refresh the page to see the changes.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to populate test data. Check console for details.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while populating test data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await clearTestData();
      if (result.success) {
        setMessage({ type: 'success', text: 'Test data cleared successfully! Refresh the page to see the changes.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to clear test data. Check console for details.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while clearing test data.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-neutral-400">Manage test data for development and testing</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Populate Data */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Populate Test Data</h2>
            </div>
            <p className="text-neutral-400 mb-6">
              Add sample users, posts, and following relationships to test the application functionality.
            </p>
            <button
              onClick={handlePopulateData}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Users className="w-5 h-5" />
              )}
              {isLoading ? 'Populating...' : 'Populate Data'}
            </button>
          </div>

          {/* Clear Data */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Clear Test Data</h2>
            </div>
            <p className="text-neutral-400 mb-6">
              Remove all test users and posts from the database. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {isLoading ? 'Clearing...' : 'Clear Data'}
            </button>
          </div>
        </div>

        {/* Test Data Info */}
        <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Test Data Information</h2>
          </div>
          <div className="space-y-3 text-neutral-300">
            <p><strong>Users:</strong> 6 test users with different specializations and verification status</p>
            <p><strong>Posts:</strong> 3 sample posts from different sports</p>
            <p><strong>Following:</strong> Pre-configured following relationships between users</p>
            <p><strong>Features:</strong> All users have complete profiles with bios, social media, and specializations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

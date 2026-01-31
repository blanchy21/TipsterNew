'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-lg">If you can see this, React is working!</p>
      <p className="text-sm text-gray-400 mt-4">Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}

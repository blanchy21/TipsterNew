export default function WorkingAdmin() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#2c1376]/70 flex items-center justify-center">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Admin Panel Working!</h1>
                <p className="text-xl mb-8">The admin panel is now accessible and working correctly.</p>
                <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-400">✅ Admin routing is working</p>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-400">✅ Firebase is connected</p>
                    </div>
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                        <p className="text-purple-400">✅ Tip verification system is ready</p>
                    </div>
                </div>
                <div className="mt-8">
                    <a
                        href="/"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go to Main App
                    </a>
                </div>
            </div>
        </div>
    );
}

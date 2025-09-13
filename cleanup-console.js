#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to process
const filesToProcess = [
    'src/lib/firebase/firebaseUtils.ts',
    'src/components/App.tsx',
    'src/lib/contexts/AuthContext.tsx',
    'src/lib/firebase/tipVerification.ts',
    'src/lib/contexts/FollowingContext.tsx',
    'src/components/features/TipVerificationPanel.tsx',
    'src/lib/populateTestData.ts',
    'src/lib/firebase/firebase.ts',
    'src/lib/firebase/messagingUtils.ts',
    'src/lib/contexts/NotificationsContext.tsx'
];

function cleanupConsoleStatements(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let removedCount = 0;

        // Remove debug console.log statements (but keep error logging)
        const debugLogPattern = /^\s*console\.log\([^)]*\);\s*$/gm;
        const debugLogMatches = content.match(debugLogPattern);
        if (debugLogMatches) {
            content = content.replace(debugLogPattern, '');
            removedCount += debugLogMatches.length;
            modified = true;
        }

        // Remove console.warn statements (but keep error logging)
        const warnPattern = /^\s*console\.warn\([^)]*\);\s*$/gm;
        const warnMatches = content.match(warnPattern);
        if (warnMatches) {
            content = content.replace(warnPattern, '');
            removedCount += warnMatches.length;
            modified = true;
        }

        // Remove multi-line console.log statements
        const multiLineLogPattern = /^\s*console\.log\(\s*[^)]*\s*\);\s*$/gms;
        const multiLineMatches = content.match(multiLineLogPattern);
        if (multiLineMatches) {
            content = content.replace(multiLineLogPattern, '');
            removedCount += multiLineMatches.length;
            modified = true;
        }

        // Clean up empty lines that might be left behind
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Cleaned ${filePath}: removed ${removedCount} console statements`);
            return removedCount;
        } else {
            console.log(`ℹ️  No changes needed for ${filePath}`);
            return 0;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

// Process files
let totalRemoved = 0;
filesToProcess.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        totalRemoved += cleanupConsoleStatements(filePath);
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log(`\n🎉 Console cleanup complete! Removed ${totalRemoved} debug console statements.`);
console.log('ℹ️  Note: console.error statements were preserved for production error tracking.');

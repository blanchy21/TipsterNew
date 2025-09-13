#!/usr/bin/env node

const fs = require('fs');

function cleanupRemainingConsole(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let removedCount = 0;

        // Remove console.log statements with complex objects
        const complexLogPattern = /^\s*console\.log\([^)]*\);\s*$/gm;
        const complexMatches = content.match(complexLogPattern);
        if (complexMatches) {
            content = content.replace(complexLogPattern, '');
            removedCount += complexMatches.length;
            modified = true;
        }

        // Remove multi-line console.log statements
        const multiLinePattern = /console\.log\([^)]*\);\s*/gms;
        const multiLineMatches = content.match(multiLinePattern);
        if (multiLineMatches) {
            content = content.replace(multiLinePattern, '');
            removedCount += multiLineMatches.length;
            modified = true;
        }

        // Clean up empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Cleaned ${filePath}: removed ${removedCount} console statements`);
            return removedCount;
        }
        return 0;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

// Clean up specific files with remaining console statements
const filesToClean = [
    'src/lib/firebase/tipVerification.ts'
];

let totalRemoved = 0;
filesToClean.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        totalRemoved += cleanupRemainingConsole(filePath);
    }
});

console.log(`\n🎉 Final cleanup complete! Removed ${totalRemoved} console statements.`);

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

        // Remove console.log statements that are part of larger expressions
        const inlineLogPattern = /console\.log\([^)]*\);\s*/g;
        const inlineMatches = content.match(inlineLogPattern);
        if (inlineMatches) {
            content = content.replace(inlineLogPattern, '');
            removedCount += inlineMatches.length;
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

// Get all files with console statements
const { execSync } = require('child_process');
const filesWithConsole = execSync('find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "console\\."', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.length > 0);

console.log(`Found ${filesWithConsole.length} files with console statements`);

// Process all files
let totalRemoved = 0;
filesWithConsole.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        totalRemoved += cleanupConsoleStatements(filePath);
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log(`\n🎉 Console cleanup complete! Removed ${totalRemoved} debug console statements.`);
console.log('ℹ️  Note: console.error statements were preserved for production error tracking.');

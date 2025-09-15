#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Console statement removed for production

// Get all TypeScript/JavaScript files
const files = execSync('find src -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.length > 0);

let totalRemoved = 0;
let filesProcessed = 0;

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        let modified = false;
        const newLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip if line doesn't contain console
            if (!line.includes('console.')) {
                newLines.push(line);
                continue;
            }

            // Check if it's a console statement (with proper indentation)
            const consoleMatch = line.match(/^(\s*)(console\.(log|warn|error|info|debug)\([^)]*\);?)/);

            if (consoleMatch) {
                const [, indent, consoleStatement] = consoleMatch;

                // Skip if it's in a comment
                if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
                    newLines.push(line);
                    continue;
                }

                // Skip if it's in a string literal
                if (line.includes('"console.') || line.includes("'console.")) {
                    newLines.push(line);
                    continue;
                }

                // Remove the console statement
                // Console statement removed for production
                totalRemoved++;
                modified = true;

                // If the line only contained the console statement, add empty line or keep structure
                if (line.trim() === consoleStatement.trim()) {
                    newLines.push(indent + '// Console statement removed for production');
                } else {
                    // If there was other content on the line, keep the rest
                    const remainingContent = line.replace(consoleStatement, '').trim();
                    if (remainingContent) {
                        newLines.push(remainingContent);
                    } else {
                        newLines.push(indent + '// Console statement removed for production');
                    }
                }
            } else {
                newLines.push(line);
            }
        }

        if (modified) {
            fs.writeFileSync(file, newLines.join('\n'));
            filesProcessed++;
        }
    } catch (error) {
        // Console statement removed for production
    }
});

// Console statements removed for production
// Statistics: Files processed, console statements removed, total files scanned

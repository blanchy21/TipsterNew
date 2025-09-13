#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function convertRelativeToAlias(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let convertedCount = 0;

        // Get the directory of the current file relative to src
        const srcPath = path.relative(process.cwd() + '/src', path.dirname(filePath));
        const depth = srcPath.split('/').length;

        // Convert relative imports to @/ alias
        const relativeImportPattern = /from\s+['"]\.\.\/([^'"]+)['"]/g;
        const matches = content.match(relativeImportPattern);

        if (matches) {
            matches.forEach(match => {
                const importPath = match.match(/['"]\.\.\/([^'"]+)['"]/)[1];

                // Calculate the correct @/ path
                let aliasPath = '';
                if (depth === 0) {
                    // File is directly in src
                    aliasPath = `@/${importPath}`;
                } else {
                    // File is in a subdirectory
                    const backSteps = depth;
                    const pathParts = importPath.split('/');
                    const actualPath = pathParts.slice(backSteps).join('/');
                    aliasPath = `@/${actualPath}`;
                }

                const newImport = `from '${aliasPath}'`;
                content = content.replace(match, newImport);
                convertedCount++;
                modified = true;
            });
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Converted ${filePath}: ${convertedCount} imports`);
            return convertedCount;
        } else {
            console.log(`ℹ️  No changes needed for ${filePath}`);
            return 0;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

// Get all files with relative imports
const { execSync } = require('child_process');
const filesWithRelativeImports = execSync('find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "from [\'\\"]\\.\\./"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.length > 0);

console.log(`Found ${filesWithRelativeImports.length} files with relative imports`);

// Process all files
let totalConverted = 0;
filesWithRelativeImports.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        totalConverted += convertRelativeToAlias(filePath);
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log(`\n🎉 Import conversion complete! Converted ${totalConverted} relative imports to @/ alias.`);

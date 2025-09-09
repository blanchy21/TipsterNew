#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findImgElements(dir) {
  const results = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('<img') && !line.includes('<Image')) {
            results.push({
              file: filePath,
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    }
  }
  
  scanDirectory(dir);
  return results;
}

console.log('🔍 Checking for <img> elements in the codebase...\n');

const srcDir = path.join(__dirname, '..', 'src');
const results = findImgElements(srcDir);

if (results.length === 0) {
  console.log('✅ No <img> elements found! All images are using Next.js <Image> component.');
} else {
  console.log('❌ Found <img> elements that should be replaced with <Image>:');
  console.log('');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.file}:${result.line}`);
    console.log(`   ${result.content}`);
    console.log('');
  });
  
  console.log('💡 Replace these with Next.js <Image> component:');
  console.log('   import Image from "next/image";');
  console.log('   <Image src="..." alt="..." width={...} height={...} />');
}

process.exit(results.length > 0 ? 1 : 0);

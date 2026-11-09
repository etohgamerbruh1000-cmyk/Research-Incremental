import fs from 'fs';
import path from 'path';
import { globSync } from 'glob'; // or use a basic recursive file reader

// 1. Find all your source files
const files = globSync('src/**/*.{ts,tsx,js,jsx}'); 

// 2. Define the exact Regex we built earlier
const importRegex = /import\s+(\{[^}]*\bState\b[^}]*\}|[^}]+)\s+from\s+['"]@\/?state['"];?/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  if (importRegex.test(content)) {
    // 3. Rewrite it dynamically to your core types path
    const updatedContent = content.replace(importRegex, (match, imports) => {
      return `import ${imports.trim()} from '@/core/types';`;
    });
    
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`✅ Migrated imports in: ${file}`);
  }
});

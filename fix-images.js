const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Find <Image ... />
  // We use a regex that matches <Image tag, even across multiple lines
  const regex = /<Image\s+([^>]*?)>/g;
  
  content = content.replace(regex, (match, attrs) => {
    // If it already has width, height or fill, skip
    if (attrs.includes('width=') || attrs.includes('fill')) {
      return match;
    }
    
    console.log('Fixing in ' + file + ':\n' + match);
    // Add fill and sizes
    return '<Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" ' + attrs + '>';
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});
console.log('Fixed ' + changedCount + ' files.');

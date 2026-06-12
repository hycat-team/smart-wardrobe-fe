const fs = require('fs');
const path = require('path');

const files = [
  'src/app/admin/wardrobe/components/SystemWardrobeClient.tsx',
  'src/app/admin/wardrobe/components/BatchUploadModal.tsx',
  'src/app/admin/wardrobe/components/ItemEditDrawer.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace dark colors with light colors while keeping the brutalist aesthetic
  content = content
    .replace(/bg-\[\#050505\]/g, 'bg-white')
    .replace(/text-\[\#E0E0E0\]/g, 'text-black')
    .replace(/border-\[\#222\]/g, 'border-gray-300')
    .replace(/bg-\[\#0A0A0A\]/g, 'bg-white')
    .replace(/bg-\[\#111\]/g, 'bg-gray-50')
    .replace(/bg-\[\#1A1A1A\]/g, 'bg-gray-100')
    .replace(/border-\[\#333\]/g, 'border-gray-300')
    .replace(/text-\[\#4ADE80\]/g, 'text-green-600')
    .replace(/bg-\[\#4ADE80\]/g, 'bg-green-500')
    .replace(/hover:bg-\[\#4ADE80\]/g, 'hover:bg-green-500')
    .replace(/hover:border-\[\#4ADE80\]/g, 'hover:border-green-500')
    .replace(/group-hover:text-\[\#4ADE80\]/g, 'group-hover:text-green-600')
    .replace(/focus:border-\[\#4ADE80\]/g, 'focus:border-green-500')
    .replace(/focus-within:border-\[\#4ADE80\]/g, 'focus-within:border-green-500')
    .replace(/group-focus-within:text-\[\#4ADE80\]/g, 'group-focus-within:text-green-600')
    .replace(/bg-\[\#222\]/g, 'bg-gray-200')
    .replace(/text-\[\#AAA\]/g, 'text-gray-600')
    .replace(/text-\[\#888\]/g, 'text-gray-500')
    .replace(/text-\[\#666\]/g, 'text-gray-500')
    .replace(/text-\[\#444\]/g, 'text-gray-400')
    .replace(/text-\[\#555\]/g, 'text-gray-400')
    .replace(/text-white/g, 'text-black')
    .replace(/bg-white/g, 'bg-black')
    .replace(/hover:text-white/g, 'hover:text-black')
    .replace(/hover:border-white/g, 'hover:border-black')
    .replace(/hover:bg-white/g, 'hover:bg-black')
    .replace(/text-black/g, 'text-white') // Swap back for buttons where bg is now black
    .replace(/bg-black\/80/g, 'bg-white/80')
    .replace(/hover:text-white hover:bg-white hover:text-black/g, 'hover:text-white hover:bg-black')
    .replace(/text-white px-6 py-3 font-mono/g, 'text-white px-6 py-3 font-mono') // restore accidentally swapped text
    
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Light theme applied.');

const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const dirs = [
  'd:\\Project\\smart-wardrobe\\smart-wardrobe-fe\\src\\app\\(user)\\outfits',
  'd:\\Project\\smart-wardrobe\\smart-wardrobe-fe\\src\\features\\outfits',
  'd:\\Project\\smart-wardrobe\\smart-wardrobe-fe\\src\\app\\(user)\\ai-stylist'
];

let files = [];
dirs.forEach(d => {
  if (fs.existsSync(d)) {
    files = files.concat(walkSync(d).filter(f => f.endsWith('.ts') || f.endsWith('.tsx')));
  }
});

const replacements = {
  'wardrobe_item_id': 'wardrobeItemId',
  'position_x': 'positionX',
  'position_y': 'positionY',
  'layer_order': 'layerOrder',
  'cover_image_url': 'coverImageUrl',
  'cover_public_id': 'coverPublicId',
  'wardrobe_item': 'wardrobeItem',
  'user_id': 'userId',
  'created_at': 'createdAt',
  'updated_at': 'updatedAt'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [snake, camel] of Object.entries(replacements)) {
    // Replace whole words only
    const regex = new RegExp(`\\b${snake}\\b`, 'g');
    content = content.replace(regex, camel);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done renaming snake_case to camelCase.');

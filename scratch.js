const fs = require('fs');
const files = [
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/wardrobe/queries/wardrobe.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/subscription/queries/subscription.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/outfits/queries/outfits.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/profile/queries/profile.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/community/queries/community.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/billing/queries/billing.queries.ts',
  'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/auth/queries/auth.queries.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import\s+\{\s*getApiErrorMessage\s*\}\s+from\s+'@\/lib\/api-error';/g, "import { handleApiError } from '@/lib/api-error';");
  content = content.replace(/toast\.error\(getApiErrorMessage\(([^)]+)\)\);/g, 'handleApiError($1);');
  fs.writeFileSync(file, content);
});
console.log('Done!');

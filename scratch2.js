const fs = require('fs');
const file = 'd:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/admin/queries/admin.queries.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/import \{ toast \} from 'sonner';/, "import { toast } from 'sonner';\nimport { handleApiError } from '@/lib/api-error';");
content = content.replace(/onError:\s*\(\)\s*=>\s*toast\.error\('([^']+)'\)/g, "onError: (error) => handleApiError(error, '$1')");
content = content.replace(/onError:\s*\(\)\s*=>\s*\{\s*toast\.error\('([^']+)'\);\s*\}/g, "onError: (error) => {\n      handleApiError(error, '$1');\n    }");
fs.writeFileSync(file, content);
console.log('Done admin!');

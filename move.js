const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const catalogDir = 'src/app/admin/catalog/components';
const wardrobeDir = 'src/app/admin/wardrobe/components';
const wardrobePageDir = 'src/app/admin/wardrobe';

if (!fs.existsSync(wardrobeDir)) {
  fs.mkdirSync(wardrobeDir, { recursive: true });
}

// 1. Rename the newly created files to the wardrobe directory
fs.renameSync(path.join(catalogDir, 'CatalogClient.tsx'), path.join(wardrobeDir, 'SystemWardrobeClient.tsx'));
fs.renameSync(path.join(catalogDir, 'BatchUploadModal.tsx'), path.join(wardrobeDir, 'BatchUploadModal.tsx'));
fs.renameSync(path.join(catalogDir, 'ItemEditDrawer.tsx'), path.join(wardrobeDir, 'ItemEditDrawer.tsx'));

// 2. Restore the original CatalogClient.tsx from git
execSync('git restore src/app/admin/catalog/components/CatalogClient.tsx');

// 3. Create the page.tsx for wardrobe
const pageContent = `import { Metadata } from "next";
import { SystemWardrobeClient } from "./components/SystemWardrobeClient";

export const metadata: Metadata = {
  title: "Trang Phục Hệ Thống | Smart Wardrobe Admin",
  description: "Quản lý trang phục mẫu của hệ thống.",
};

export default function AdminWardrobePage() {
  return <SystemWardrobeClient />;
}
`;
fs.writeFileSync(path.join(wardrobePageDir, 'page.tsx'), pageContent, 'utf8');

console.log('Files moved and restored successfully!');

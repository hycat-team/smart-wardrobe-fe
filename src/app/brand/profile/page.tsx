import { Metadata } from 'next';
import { BrandProfileSettingsClient } from './components/BrandProfileSettingsClient';

export const metadata: Metadata = {
  title: 'Hồ sơ Thương hiệu | Brand Workspace',
};

export default function BrandProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ Thương hiệu</h1>
      </div>
      <BrandProfileSettingsClient />
    </div>
  );
}

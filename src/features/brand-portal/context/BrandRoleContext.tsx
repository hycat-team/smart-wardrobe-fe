"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useGetBrandProfile } from '@/features/brand-portal/queries/brand-portal.queries';

interface BrandRoleContextValue {
  memberRole: 'owner' | 'staff' | null;
  isOwner: boolean;
  isStaff: boolean;
  isLoading: boolean;
}

const BrandRoleContext = createContext<BrandRoleContextValue>({
  memberRole: null,
  isOwner: false,
  isStaff: false,
  isLoading: true,
});

export const useBrandRole = () => useContext(BrandRoleContext);

interface BrandRoleProviderProps {
  brandId: string;
  children: ReactNode;
}

export const BrandRoleProvider: React.FC<BrandRoleProviderProps> = ({ brandId, children }) => {
  const { data: brandProfile, isLoading } = useGetBrandProfile(brandId);

  const memberRole = brandProfile?.memberRole || null;
  const isOwner = memberRole === 'owner';
  const isStaff = memberRole === 'staff';

  return (
    <BrandRoleContext.Provider
      value={{
        memberRole,
        isOwner,
        isStaff,
        isLoading,
      }}
    >
      {children}
    </BrandRoleContext.Provider>
  );
};

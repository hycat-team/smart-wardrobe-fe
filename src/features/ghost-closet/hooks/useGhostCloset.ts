import { useState, useEffect } from 'react';
import { GhostItem } from '../types';

export function useGhostCloset() {
  const [ghostClosetEnabled, setGhostClosetEnabled] = useState(false);
  const [savedGhostItems, setSavedGhostItems] = useState<string[]>([]);
  const [waitlistItems, setWaitlistItems] = useState<string[]>([]);
  const [hiddenBrands, setHiddenBrands] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEnabled = localStorage.getItem('closy_ghost_enabled');
      if (storedEnabled) setGhostClosetEnabled(storedEnabled === 'true');

      const storedSaved = localStorage.getItem('closy_ghost_saved');
      if (storedSaved) setSavedGhostItems(JSON.parse(storedSaved));

      const storedWaitlist = localStorage.getItem('closy_ghost_waitlist');
      if (storedWaitlist) setWaitlistItems(JSON.parse(storedWaitlist));

      const storedHidden = localStorage.getItem('closy_ghost_hidden_brands');
      if (storedHidden) setHiddenBrands(JSON.parse(storedHidden));
    }
  }, []);

  const toggleGhostCloset = (enabled: boolean) => {
    setGhostClosetEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('closy_ghost_enabled', enabled.toString());
    }
  };

  const saveItem = (itemId: string) => {
    const updated = [...new Set([...savedGhostItems, itemId])];
    setSavedGhostItems(updated);
    if (typeof window !== 'undefined') localStorage.setItem('closy_ghost_saved', JSON.stringify(updated));
  };

  const joinWaitlist = (itemId: string) => {
    const updated = [...new Set([...waitlistItems, itemId])];
    setWaitlistItems(updated);
    if (typeof window !== 'undefined') localStorage.setItem('closy_ghost_waitlist', JSON.stringify(updated));
  };

  const hideBrand = (brandId: string) => {
    const updated = [...new Set([...hiddenBrands, brandId])];
    setHiddenBrands(updated);
    if (typeof window !== 'undefined') localStorage.setItem('closy_ghost_hidden_brands', JSON.stringify(updated));
  };

  const logGhostAction = (sampleId: string, action: 'save' | 'waitlist' | 'notMyStyle' | 'swap' | 'keep') => {
    if (typeof window === 'undefined') return;
    const statsStr = localStorage.getItem('closy_ghost_analytics');
    const stats = statsStr ? JSON.parse(statsStr) : {};
    
    if (!stats[sampleId]) {
      stats[sampleId] = { save: 0, waitlist: 0, notMyStyle: 0, swap: 0, keep: 0 };
    }
    stats[sampleId][action] += 1;
    localStorage.setItem('closy_ghost_analytics', JSON.stringify(stats));
  };

  return {
    ghostClosetEnabled,
    toggleGhostCloset,
    savedGhostItems,
    saveItem,
    waitlistItems,
    joinWaitlist,
    hiddenBrands,
    hideBrand,
    logGhostAction,
  };
}

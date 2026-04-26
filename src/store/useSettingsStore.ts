import { create } from 'zustand';

interface SettingsStore {
  strictness: number;
  hintFrequency: number;
  unlockThreshold: number;
  setStrictness: (v: number) => void;
  setHintFrequency: (v: number) => void;
  setUnlockThreshold: (v: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  strictness: 75,
  hintFrequency: 50,
  unlockThreshold: 60,
  setStrictness: (v) => set({ strictness: v }),
  setHintFrequency: (v) => set({ hintFrequency: v }),
  setUnlockThreshold: (v) => set({ unlockThreshold: v }),
}));

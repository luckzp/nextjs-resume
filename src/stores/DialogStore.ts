'use client';

import { create } from 'zustand';

interface DialogState {
  isChangeOpened: boolean;
  setChangeOpened: (value: boolean) => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isChangeOpened: false,
  setChangeOpened: (value: boolean) => set({ isChangeOpened: value }),
}));

export default useDialogStore;

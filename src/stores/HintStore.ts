'use client';

import { create } from 'zustand';

interface ErrorState {
  isOpen: boolean;
  message: string;
}

interface SuccessState {
  isOpen: boolean;
  message: string;
}

interface HintState {
  error: ErrorState;
  success: SuccessState;
  setSuccess: (success: Partial<SuccessState>) => void;
  setError: (error: Partial<ErrorState>) => void;
}

/**
 * Store for managing feedback messages (error and success hints)
 */
const useHintStore = create<HintState>((set) => ({
  error: {
    isOpen: false,
    message: "操作出错"
  },
  
  success: {
    isOpen: false,
    message: "操作成功"
  },

  setSuccess: (success) => set((state) => ({
    success: { ...state.success, ...success }
  })),

  setError: (error) => set((state) => ({
    error: { ...state.error, ...error }
  }))
}));

export default useHintStore;

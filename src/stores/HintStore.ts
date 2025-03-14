'use client';

import { makeAutoObservable } from 'mobx';

interface ErrorState {
  isOpen: boolean;
  message: string;
}

interface SuccessState {
  isOpen: boolean;
  message: string;
}

/**
 * Store for managing feedback messages (error and success hints)
 */
class HintStore {
  error: ErrorState = {
    isOpen: false,
    message: "操作出错"
  };
  
  success: SuccessState = {
    isOpen: false,
    message: "操作成功"
  };

  constructor() {
    makeAutoObservable(this);
  }

  setSuccess = (success: Partial<SuccessState>) => {
    this.success = Object.assign({}, this.success, success);
  };

  setError = (error: Partial<ErrorState>) => {
    this.error = Object.assign({}, this.error, error);
  };
}

// Create and export a store instance
const store = new HintStore();
export default store;

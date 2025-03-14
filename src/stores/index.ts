'use client';

import { makeAutoObservable } from 'mobx';
import NavbarStore from './NavbarStore';
import HintStore from './HintStore';
import ResumeStore from './ResumeStore';


/**
 * Root store that contains all feature stores
 */
class RootStore {
  navbar = NavbarStore;
  hint = HintStore;
  resume = ResumeStore;
  
  constructor() {
    // Use the imported store instances directly
    makeAutoObservable(this);
    
    // 立即尝试初始化ResumeStore，仅在客户端环境
    if (typeof window !== 'undefined') {
      console.log('RootStore: 开始初始化 ResumeStore...');
      
      // 直接尝试初始化
      if (!this.resume.initialized) {
        try {
          // 确保在初始化之前清除旧数据
          if (this.resume.layout.length > 0) {
            this.resume.layout.splice(0, this.resume.layout.length);
          }
          
          // 初始化
          this.resume.initialize();
          console.log('RootStore: ResumeStore 初始化完成，布局项目数:', this.resume.layout.length);
        } catch (error) {
          console.error('RootStore: 初始化 ResumeStore 时出错:', error);
          
          // 如果初始化失败，尝试使用setTimeout
          setTimeout(() => {
            if (!this.resume.initialized) {
              try {
                this.resume.initialize();
                console.log('RootStore: 使用setTimeout成功初始化 ResumeStore，布局项目数:', this.resume.layout.length);
              } catch (error) {
                console.error('RootStore: 即使使用setTimeout也无法初始化 ResumeStore:', error);
              }
            }
          }, 100);
        }
      } else {
        console.log('RootStore: ResumeStore 已经初始化');
      }
    }
  }
}

// Create a single store instance
const rootStore = new RootStore();

// Create a hook to use the root store
export const useStore = () => rootStore;

// Export the store instance directly
export default rootStore;

// Export type for convenience
export type TRootStore = RootStore; 
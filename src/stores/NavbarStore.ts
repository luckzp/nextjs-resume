'use client';
import { create } from "zustand";
import { TEMPLATE_NUM, MARKDOWN_MODE } from "../utils/constant";

interface NavbarState {
  isDisabled: boolean;
  themeColor: string;
  isExported: boolean;
  isMarkdownMode: boolean;
  templateNum: number;
  setBtnDisable: (isDisabled: boolean) => void;
  setThemeColor: (themeColor: string) => void;
  setExported: (isExported: boolean) => void;
  setMarkdownMode: (isMarkdownMode: boolean) => void;
  setTemplateNum: (templateNum: number) => void;
  initialize: () => void;
}

const useNavbarStore = create<NavbarState>((set, get) => ({
  isDisabled: true,
  themeColor: "#468CD4",
  isExported: false,
  isMarkdownMode: false,
  templateNum: 1,


  setBtnDisable: (isDisabled) => set({ isDisabled }),
  
  setThemeColor: (themeColor) => set({ themeColor }),
  
  setExported: (isExported) => set({ isExported }),
  
  setMarkdownMode: (isMarkdownMode) => set({ isMarkdownMode }),
  
  setTemplateNum: (templateNum) => set({ templateNum }),
  
  initialize: () => {
    let parsedTemplateNum = 1; // 默认为模板1
    
    // 优先使用专门为 NavbarStore 存储的数字索引
    const templateNumIndex = localStorage.getItem('templateNumIndex');
    if (templateNumIndex) {
      const num = parseInt(templateNumIndex);
      if (!isNaN(num)) {
        parsedTemplateNum = num;
      }
    } else {
      // 如果没有找到，则尝试从 TEMPLATE_NUM 中解析
      const templateNum = localStorage.getItem(TEMPLATE_NUM);
      if (templateNum) {
        // 兼容新的字符串形式的模板ID
        if (templateNum.startsWith('theme')) {
          // 从字符串 'themeX' 中提取数字部分
          const numPart = templateNum.replace('theme', '');
          const num = parseInt(numPart);
          if (!isNaN(num)) {
            parsedTemplateNum = num;
          }
        } else {
          // 尝试直接解析为数字
          const num = parseInt(templateNum);
          if (!isNaN(num)) {
            parsedTemplateNum = num;
          }
        }
      }
    }
    
    const markdownMode = localStorage.getItem(MARKDOWN_MODE);
    const isMarkdownMode = markdownMode === "true";
    
    set({ 
      templateNum: parsedTemplateNum, 
      isMarkdownMode
    });
  }
}));

export default useNavbarStore;

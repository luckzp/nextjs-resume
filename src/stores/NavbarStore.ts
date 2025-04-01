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

    
    const templateNum = localStorage.getItem(TEMPLATE_NUM);
    const parsedTemplateNum = templateNum ? parseInt(templateNum) : 1;
    const markdownMode = localStorage.getItem(MARKDOWN_MODE);
    const isMarkdownMode = markdownMode === "true";
    
    set({ 
      templateNum: parsedTemplateNum, 
      isMarkdownMode
    });
  }
}));

export default useNavbarStore;

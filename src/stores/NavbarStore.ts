'use client';
import { makeObservable, observable, action } from "mobx";
import { TEMPLATE_NUM, MARKDOWN_MODE } from "../utils/constant";

class Navbar {
  isDisabled = true;
  themeColor = "#468CD4";
  isExported = false;
  isMarkdownMode = false;
  templateNum = 1;
  initialized = false;

  constructor() {
    makeObservable(this, {
      isDisabled: observable,
      themeColor: observable,
      isExported: observable,
      isMarkdownMode: observable,
      templateNum: observable,
      setBtnDisable: action,
      setThemeColor: action,
      setExported: action,
      setMarkdownMode: action,
      setTemplateNum: action,
      initialize: action
    });
  }

  setBtnDisable = (isDisabled: boolean) => {
    this.isDisabled = isDisabled;
  };

  setThemeColor = (themeColor: string) => {
    this.themeColor = themeColor;
  };

  setExported = (isExported: boolean) => {
    this.isExported = isExported;
  };

  setMarkdownMode = (isMarkdownMode: boolean) => {
    this.isMarkdownMode = isMarkdownMode;
  };

  setTemplateNum = (templateNum: number) => {
    this.templateNum = templateNum;
  };

  initialize() {
    if (this.initialized || typeof window === 'undefined') return;
    
    const templateNum = localStorage.getItem(TEMPLATE_NUM);
    this.templateNum = templateNum ? parseInt(templateNum) : 1;
    const markdownMode = localStorage.getItem(MARKDOWN_MODE);
    this.isMarkdownMode = markdownMode === "true" ? true : false;
    this.initialized = true;
  }
}

const store = new Navbar();
export default store;

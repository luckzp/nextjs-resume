'use client';
import { makeObservable, observable, action } from "mobx";
import { calclayout, generateItem, parseMarkdown } from "../utils/helper";
import { 
  COLOR_NORMAL, 
  ADD_DEFAULT_WIDTH, 
  ADD_DEFAULT_HEIGHT, 
  MARK, 
  STORAGE_LAYOUT,
  DATA_MARKDOWN,
  DATA_ORIGIN
} from "../utils/constant";
// 直接导入LAYOUT，它是THEME1的默认导出
import LAYOUT from "../utils/theme1";
// 为了调试，也保留原始导入名称
import THEME1_DEFAULT from "../utils/theme1";

// Define Resume store types
type Status = {
  isResizable: boolean;
  isDraggable: boolean;
  gridStyle: React.CSSProperties;
};

type LayoutItem = {
  i: string;
  value: string;
  x: number;
  y: number;
  w: number;
  h: number;
  origin?: string; // Added for normal mode
};

class Resume {
  choosenKey = "";
  isAdded = false;
  layout: LayoutItem[] = [];
  status: Status = {
    isResizable: false,
    isDraggable: false,
    gridStyle: { background: COLOR_NORMAL },
  };
  count = 0;
  initialized = false;

  constructor() {
    makeObservable(this, {
      choosenKey: observable,
      isAdded: observable,
      layout: observable,
      status: observable,
      count: observable,
      initialized: observable,
      addGrid: action,
      setAdded: action,
      switchStyle: action,
      removeGrid: action,
      updateResume: action,
      updateNormalResume: action,
      updateLayout: action,
      setChoosen: action,
      setStatus: action,
      switchLayout: action,
      initialize: action,
      _loadFromTheme1: action
    });
  }

  setAdded = (isAdded: boolean) => {
    this.isAdded = isAdded;
  };

  setChoosen = (key: string = "") => {
    this.switchStyle(this.choosenKey, false);
    this.choosenKey = key;
    this.switchStyle(this.choosenKey, true);
  };

  setStatus = (status: Partial<Status>, isMarkdownMode: boolean) => {
    if (isMarkdownMode) {
      this.updateResume();
    } else {
      this.updateNormalResume();
    }
    this.status = { ...this.status, ...status };
  };

  switchStyle = (id: string, isActive: boolean) => {
    if (!id) {
      return;
    }
    const element = document.getElementById(id);
    if (!element) return;
    
    // Cast to HTMLElement to access style property safely
    const htmlElement = element as HTMLElement;
    
    if (isActive) {
      htmlElement.contentEditable = "true";
      htmlElement.style.background = "white";
      htmlElement.style.outline = "rgba(0, 103, 244, 0.247) auto 5px";
      htmlElement.style.zIndex = "999";
    } else {
      htmlElement.style.background = COLOR_NORMAL;
      htmlElement.style.outline = "none";
      htmlElement.style.zIndex = "1";
      htmlElement.contentEditable = "false";
    }
  };

  updateLayout = (layout: LayoutItem[]) => {
    // Add debug information
    console.log('Updating layout:', layout);
    
    if (layout.length === 0 || this.layout.length === 0) {
      console.warn('Empty layout detected, skipping update');
      return;
    }
    
    // 创建一个布局项目的映射，以便于通过ID查找
    const currentLayoutMap = new Map<string, LayoutItem>();
    this.layout.forEach(item => {
      currentLayoutMap.set(item.i, item);
    });
    
    // 安全地更新布局项目的属性
    layout.forEach(item => {
      if (!item) return;
      
      const currentItem = currentLayoutMap.get(item.i);
      if (currentItem) {
        // 保留值和原始值
        item.value = currentItem.value || '';
        item.origin = currentItem.origin || '';
        
        // 更新当前布局中的位置和大小
        currentItem.w = item.w;
        currentItem.h = item.h;
        currentItem.x = item.x;
        currentItem.y = item.y;
      }
    });
    
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(layout));
  };

  updateResume = () => {
    if (!this.choosenKey) {
      return;
    }
    const element = document.getElementById(this.choosenKey);
    if (!element) return;
    
    element.contentEditable = "false";
    const modifyContent = element.innerText;
    this.layout.forEach(item => {
      if (item.i === this.choosenKey) {
        // Set chosen to empty to avoid resume rendering componentDidUpdate override
        this.setChoosen();
        // When the value doesn't change, mobx doesn't work and won't re-render
        const [html] = parseMarkdown(modifyContent);
        const firstChild = element.firstChild as HTMLElement;
        if (firstChild) {
          firstChild.innerHTML = html;
        }
        item.value = modifyContent;
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(this.layout));
  };

  updateNormalResume = () => {
    if (!this.choosenKey) {
      return;
    }
    const element = document.getElementById(this.choosenKey);
    if (!element) return;
    
    element.contentEditable = "false";
    const firstChild = element.firstChild as HTMLElement;
    if (!firstChild) return;
    
    const modifyContent = firstChild.innerHTML;
    
    this.layout.forEach(item => {
      if (item.i === this.choosenKey) {
        // Set chosen to empty to avoid resume rendering componentDidUpdate override
        this.setChoosen();
        // When the value doesn't change, mobx doesn't work and won't re-render
        firstChild.innerHTML = modifyContent;
        item.origin = modifyContent;
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(this.layout));
  };

  addGrid = (isMarkdownMode: boolean) => {
    this.setAdded(true);
    if (this.choosenKey) {
      if (isMarkdownMode) {
        this.updateResume();
      } else {
        this.updateNormalResume();
      }
      this.switchStyle(this.choosenKey, false);
    }
    const key = "item" + MARK + this.count;
    const item = generateItem(key);
    this.layout = this.layout.concat(item);
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(this.layout));
    this.count++;
    this.choosenKey = key;
  };

  removeGrid = () => {
    const key = this.choosenKey;
    this.layout = this.layout.filter(item => item.i !== key);
    this.choosenKey = "";
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(this.layout));
  };

  switchLayout = (unsortLayout: any[]) => {
    if (typeof window === 'undefined') return;
    
    window.localStorage.removeItem(STORAGE_LAYOUT);
    const result = calclayout(unsortLayout);
    if (Array.isArray(result) && result.length === 2) {
      const layout = result[0] as LayoutItem[];
      const count = result[1] as number;
      
      // 清空当前布局并添加新项目
      this.layout.splice(0, this.layout.length);
      layout.forEach(item => {
        this.layout.push(item);
      });
      
      this.count = count;
      this.setChoosen();
      this.setStatus(
        {
          isResizable: false,
          isDraggable: false,
          gridStyle: { background: COLOR_NORMAL }
        },
        false
      );
      
      // 保存到localStorage
      window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(this.layout));
    }
  };

  initialize() {
    if (this.initialized || typeof window === 'undefined') return;
    
    console.log('初始化ResumeStore...');
    
    try {
      // 清除localStorage，强制使用theme1数据
      if (window.localStorage.getItem(STORAGE_LAYOUT)) {
        console.log('清除localStorage，强制使用theme1数据');
        window.localStorage.removeItem(STORAGE_LAYOUT);
      }
      
      console.log('直接加载theme1数据');
      this._loadFromTheme1();
      
      this.initialized = true;
    } catch (error) {
      console.error('初始化时出错:', error);
    }
  }

  // 从THEME1加载完整的64个项目
  _loadFromTheme1() {
    console.log('正在加载theme1中的所有数据...');
    console.log('LAYOUT类型:', typeof LAYOUT);
    console.log('LAYOUT可用性检查:', !!LAYOUT, '是数组:', Array.isArray(LAYOUT), '长度:', LAYOUT ? LAYOUT.length : 0);
    
    try {
      // 清空当前布局
      this.layout.splice(0, this.layout.length);
      
      // 确保LAYOUT可用
      if (LAYOUT && Array.isArray(LAYOUT) && LAYOUT.length > 0) {
        // 直接使用LAYOUT数据
        console.log('添加', LAYOUT.length, '个项目到布局');
        
        LAYOUT.forEach((item, index) => {
          // 仅记录前10个和最后10个，避免控制台输出太多
          if (index < 10 || index >= LAYOUT.length - 10) {
            console.log(`添加第${index+1}个项目:`, item.i);
          } else if (index === 10) {
            console.log(`... 省略 ${LAYOUT.length - 20} 个项目 ...`);
          }
          
          this.layout.push({
            i: item.i,
            value: item.value || '',
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            origin: item.origin
          });
        });
        
        // 设置count为LAYOUT长度+1
        this.count = LAYOUT.length + 1;
        console.log('成功从theme1加载了', this.layout.length, '个项目');
      } else {
        console.error('LAYOUT数据不可用或为空，回退到测试布局');
      }
    } catch (error) {
      console.error('加载LAYOUT时出错:', error);

    }
  }

  
}

const store = new Resume();

// 不再需要这个自动初始化代码，让组件来控制初始化
// if (typeof window !== 'undefined') {
//   setTimeout(() => {
//     store.initialize();
//     console.log('Resume store initialized, layout:', store.layout);
//   }, 0);
// }

export default store; 
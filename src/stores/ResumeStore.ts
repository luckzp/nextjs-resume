'use client';
import { create } from "zustand";
import { generateItem, parseMarkdown } from "../utils/helper";
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

// Helper function to compare layout items based on their 'i' property
const compare = (pro: keyof LayoutItem) => {
  return function(obj1: LayoutItem, obj2: LayoutItem) {
    const val1 = obj1[pro];
    const val2 = obj2[pro];
    // Ensure values are strings before splitting
    if (typeof val1 !== 'string' || typeof val2 !== 'string') {
      // Handle cases where 'i' might not be a string as expected
      // You might want to return 0 or throw an error depending on desired behavior
      console.warn("Attempted to compare non-string 'i' properties:", val1, val2);
      return 0;
    }
    const arr1 = val1.split(MARK);
    const arr2 = val2.split(MARK);
    // Add checks for successful split and numeric parsing
    const num1 = parseInt(arr1[1]);
    const num2 = parseInt(arr2[1]);
    if (isNaN(num1) || isNaN(num2)) {
      console.warn("Could not parse numeric part of 'i' property for comparison:", val1, val2);
      return 0; // Or handle error appropriately
    }
    return num1 - num2;
  };
};

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
  moved?: boolean;
  static?: boolean;
  origin?: string; // Added for normal mode
};

interface ResumeState {
  choosenKey: string;
  isAdded: boolean;
  layout: LayoutItem[];
  status: Status;
  count: number;
  
  setAdded: (isAdded: boolean) => void;
  setChoosen: (key?: string) => void;
  setStatus: (status: Partial<Status>, isMarkdownMode: boolean) => void;
  switchStyle: (id: string, isActive: boolean) => void;
  updateLayout: (layout: LayoutItem[]) => void;
  updateResume: () => void;
  updateNormalResume: () => void;
  addGrid: (isMarkdownMode: boolean) => void;
  removeGrid: () => void;
  switchLayout: (unsortLayout: any[]) => void;
  calcLayout: (unsortLayout: LayoutItem[]) => [LayoutItem[], number];
  initialize: () => void;
}


const useResumeStore = create<ResumeState>((set, get) => ({
  choosenKey: "",
  isAdded: false,
  layout: [],
  status: {
    isResizable: false,
    isDraggable: false,
    gridStyle: { background: COLOR_NORMAL },
  },
  count: 0,

  // Add the calcLayout function implementation
  calcLayout: (unsortLayout) => {
    if (!unsortLayout || unsortLayout.length === 0) {
      return [[], 0];
    }
    // Ensure the input is actually LayoutItem[] before sorting
    const layout = [...unsortLayout].sort(compare("i"));
    const len = layout.length;
    let count = 0;
    if (len > 0) {
      const lastItemI = layout[len - 1]?.i;
      if (typeof lastItemI === 'string') {
         const parts = lastItemI.split(MARK);
         const lastNum = parseInt(parts[1]);
         if (!isNaN(lastNum)) {
            count = lastNum + 1;
         } else {
            console.warn("Could not parse count from last item's 'i':", lastItemI);
            // Fallback or error handling if needed
            count = len; // Example fallback
         }
      } else {
         console.warn("Last item's 'i' is not a string:", lastItemI);
         // Fallback or error handling
         count = len; // Example fallback
      }
    }
    return [layout, count];
  },

  setAdded: (isAdded) => set({ isAdded }),

  setChoosen: (key = "") => {
    const state = get();
    state.switchStyle(state.choosenKey, false);
    set({ choosenKey: key });
    state.switchStyle(key, true);
  },

  setStatus: (status, isMarkdownMode) => {
    const state = get();
    
    if (isMarkdownMode) {
      state.updateResume();
    } else {
      state.updateNormalResume();
    }
    
    set((state) => ({ status: { ...state.status, ...status } }));
  },

  switchStyle: (id, isActive) => {
    if (!id) {
      return;
    }
    const element = document.getElementById(id);
    if (!element) return;
    console.log(id);

    if (isActive) {
      element.contentEditable = "true";
      element.style.background = "white";
      element.style.outline = "rgba(0, 103, 244, 0.247) auto 5px";
      element.style.zIndex = "999";
    } else {
      element.style.background = COLOR_NORMAL;
      element.style.outline = "none";
      element.style.zIndex = "1";
    }
  },

  updateLayout: (layout) => {
    layout.forEach((item, index) => {
      const { w, h, x, y } = item;
      const state = get();
      
      // Check if the item at this index exists in the current state
      if (index < state.layout.length) {
        // Safely update values
        item.value = state.layout[index]?.value || "";
        item.origin = state.layout[index]?.origin || "";
        
        // Use optional chaining for property assignments
        if (state.layout[index]) {
          state.layout[index].w = w;
          state.layout[index].h = h;
          state.layout[index].x = x;
          state.layout[index].y = y;
        }
      }
    });
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(layout));
  },

  updateResume: () => {
    
    const state = get();
    const { choosenKey } = state;
    if (!choosenKey) return;

    const element = document.getElementById(choosenKey);
    if (!element) return;

    element.contentEditable = "false";
    const modifyContent = element.innerText;
    state.layout.forEach(item => {
      if (item.i === state.choosenKey) {
        // 很重要，在找到key之后马上变成空，避免resume渲染componentDidUpdate覆盖
        state.setChoosen();
        // 当值不改变时mobx不起作用，不会重渲染
        const [html] = parseMarkdown(modifyContent);
        (element.childNodes[0] as HTMLElement).innerHTML = html;
        item.value = modifyContent;
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(state.layout));
  },

  updateNormalResume: () => {
 
    
    const state = get();
    const { choosenKey } = state;
    if (!choosenKey) return;

    const element = document.getElementById(choosenKey);
    if (!element) return;

    element.contentEditable = "false";
    const modifyContent = (element.childNodes[0] as HTMLElement).innerHTML;
    state.layout.forEach(item => {
      if (item.i === state.choosenKey) {
        // 很重要，在找到key之后马上变成空，避免resume渲染componentDidUpdate覆盖
        state.setChoosen();
        (element.childNodes[0] as HTMLElement).innerHTML = modifyContent;
        item.origin = modifyContent;
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(state.layout));
  },

  addGrid: (isMarkdownMode) => {
    const state = get();
    state.setAdded(true);
    const { choosenKey } = state;
    if (choosenKey) {
      if (isMarkdownMode) {
        state.updateResume();
      } else {
        state.updateNormalResume();
      }
      state.switchStyle(choosenKey, false);
    }

    
    const itemKey = `item${MARK}${state.count}`;
    const item: LayoutItem = {
      i: itemKey,
      x: 0,
      y: Infinity,
      w: ADD_DEFAULT_WIDTH,
      h: ADD_DEFAULT_HEIGHT,
      value: ""
    };
    const layout = [...state.layout, item];
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(layout));
    set({ 
      layout, 
      count: state.count + 1,
      choosenKey: itemKey
    });

  },

  removeGrid: () => {
    const state = get();
    if (!state.choosenKey) return;
    
    const layout = state.layout.filter((item) => item.i !== state.choosenKey);
    set({ layout, choosenKey: "" });
    
    if (typeof window !== 'undefined') {
      // 保存到localStorage
      window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(layout));
    }
  },

  switchLayout: (unsortLayout) => {
    const state = get(); // Get the current state including calcLayout

    window.localStorage.removeItem(STORAGE_LAYOUT);

    // Use calcLayout to sort and get the count
    const [newLayout, newCount] = state.calcLayout(unsortLayout as LayoutItem[]); // Cast might be needed depending on input `any[]`

    // Ensure value and origin properties exist
    const processedLayout = newLayout.map(item => ({
      ...item,
      value: item.value || "",
      origin: item.origin || ""
    }));

    state.setChoosen();
    // Update state
    set({
      layout: processedLayout,
      count: newCount,
      status: {
        isResizable: false,
        isDraggable: false,
        gridStyle: { background: COLOR_NORMAL }
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(processedLayout));
  },

  initialize: () => {
    // 首先检查localStorage中是否有保存的布局数据
    const savedLayout = window.localStorage.getItem(STORAGE_LAYOUT);
    
    if (savedLayout) {
      try {
        // 尝试解析存储的布局数据
        const parsedLayout = JSON.parse(savedLayout) as LayoutItem[];
        console.log('从localStorage加载布局数据，包含', parsedLayout.length, '个项目');
        // Use calcLayout to ensure correct count and sorting from localStorage
        const [sortedLayout, count] = get().calcLayout(parsedLayout);
        set({ layout: sortedLayout, count: count });
        return;
      } catch (error) {
        console.error('解析localStorage布局数据失败:', error);
        // 解析失败时继续使用默认布局
      }
    }

    

    // Use calcLayout for the default layout as well
    const [sortedDefaultLayout, defaultCount] = get().calcLayout(LAYOUT);

    set({ layout: sortedDefaultLayout, count: defaultCount });
    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(sortedDefaultLayout));
  },
}));

export default useResumeStore;


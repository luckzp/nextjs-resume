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
  initialize: () => void;
}

// Helper function to get element position and dimensions
const getElementLayout = (element: Element): { x: number, y: number, w: number, h: number } => {
  const rect = element.getBoundingClientRect();
  // Convert to grid coordinates (approximate)
  return {
    x: Math.round(rect.left / 30), // Approximation
    y: Math.round(rect.top / 22),  // Assuming rowHeight is 22
    w: Math.max(1, Math.round(rect.width / 30)), // Minimum width of 1
    h: Math.max(1, Math.round(rect.height / 22)) // Minimum height of 1
  };
};

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

    window.localStorage.removeItem(STORAGE_LAYOUT);


    // Calculate new count based on layout items
    const newCount = unsortLayout.length;

    // Process the layout
    let newLayout = [];
    if (unsortLayout.length > 0) {
      newLayout = unsortLayout.map(item => ({
        ...item,
        value: item.value || "",
        origin: item.origin || ""
      }));
    } 

    // Update state
    set({ 
      layout: newLayout,
      count: newCount,
      choosenKey: "",
      status: {
        isResizable: false,
        isDraggable: false,
        gridStyle: { background: COLOR_NORMAL }
      }
    });

    window.localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(newLayout));
    
  },

  initialize: () => {

        // 清空当前布局
        const newLayout: LayoutItem[] = [];

          
          LAYOUT.forEach((item, index) => {

            newLayout.push({
              i: item.i,
              x: typeof item.x === 'number' ? item.x : 0,
              y: typeof item.y === 'number' ? item.y : 0,
              w: typeof item.w === 'number' ? item.w : 4,
              h: typeof item.h === 'number' ? item.h : 2,
              value: typeof item.value === 'string' ? item.value : "",
              origin: typeof item.origin === 'string' ? item.origin : "",
              moved: Boolean(item.moved),
              static: Boolean(item.static)
            });
          });
          
          console.log('新布局数据已准备好，包含', newLayout.length, '个项目');
          
    set({ layout: newLayout, count: newLayout.length });
  },
}));

export default useResumeStore;


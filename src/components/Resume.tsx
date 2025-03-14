"use client";

import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItIns from "markdown-it-ins";
// @ts-ignore
import MarkdownItMark from "markdown-it-mark";
import { makeStyles } from "@mui/styles";
import { DATA_MARKDOWN } from "../utils/constant";
import { parseMarkdown } from "../utils/helper";
import { useStore } from "../stores";
import THEME1 from "../utils/theme1";

// Define the CSS styles for the component
const useStyles = makeStyles(() => ({
  hStart: {
    justifyContent: "flex-start",
  },
  hCenter: {
    justifyContent: "center",
  },
  hEnd: {
    justifyContent: "flex-end",
  },
  vStart: {
    alignItems: "flex-start",
  },
  vCenter: {
    alignItems: "center",
  },
  vEnd: {
    alignItems: "flex-end",
  },
  layout: {
    width: "188mm",
    // height: "200vh",
    // margin: "16mm 11mm",
    "& div": {
      display: "flex",
      flexDirection: "column-reverse",
      "& mark": {
        color: "rgb(70,140,212)",
        backgroundColor: "rgba(0,0,0,0)",
        "& hr": {
          height: "100%",
          border: "0",
          color: "black",
          margin: 0,
        },
      },
      "& ins": {
        textDecoration: "none",
        width: "100%",
        "& hr": {
          width: "100%",
          border: "0",
          color: "black",
          margin: 0,
        },
      },
      "& section": {
        height: "100%",
        display: "flex",
        fontSize: "3.8mm",
        lineHeight: "24px",
        overflow: "hidden",
        width: "100%",
      },
      "& h1": {
        margin: "0",
        fontSize: "7mm",
      },
      "& h2": {
        margin: "0",
        fontSize: "4mm",
        fontWeight: "bold",
      },
      "& p": {
        fontSize: "3.8mm",
        margin: "0",
        lineHeight: "24px",
      },
      "& a": {
        fontSize: "3.8mm",
        textDecoration: "none",
        fontWeight: "bold",
      },
      "& strong": {
        width: "100%",
      },
      "& blockquote": {
        margin: "0",
        "&:before": {
          content: "''" /*CSS伪类用法*/,
          position: "absolute" /*定位背景横线的位置*/,
          bottom: "-1px",
          background: "#494949" /*宽和高做出来的背景横线*/,
          width: "100%",
          height: "1px",
        },
      },
      "& ul": {
        fontSize: "3.8mm",
        margin: "0",
        paddingInlineStart: "20px",
        lineHeight: "24px",
        width: "100%",
      },
      "& code": {
        width: "100%",
      },
      "& img": {
        width: "100%",
      },
    },
  },
}));

// Define the LayoutItem type to match the ResumeStore
interface LayoutItem {
  i: string;
  value: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const Resume = observer(() => {
  const classes = useStyles();
  const { resume, navbar } = useStore();
  const mdRef = useRef<MarkdownIt | null>(null);

  useEffect(() => {
    if (!mdRef.current) {
      const md = new MarkdownIt();
      md.use(MarkdownItIns);
      md.use(MarkdownItMark);
      mdRef.current = md;
    }
  }, []);

  // Initialize the resume store when the component mounts
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === "undefined") return;

    // 如果当前布局为空，尝试初始化
    if (resume.layout.length === 0 && !resume.initialized) {
      resume.initialize();
    }
  }, [resume]);

  useEffect(() => {
    if (resume.isAdded) {
      resume.switchStyle(resume.choosenKey, true);
    }
  }, [resume.isAdded, resume.choosenKey, resume]);

  // Set up style rules for theme colors when the component renders
  useEffect(() => {
    if (typeof document !== "undefined" && document.styleSheets[0]?.rules) {
      const styleSheet = document.styleSheets[0];

      // Safely update styles with type checking
      const updateStyle = (index: number, props: Record<string, string>) => {
        const rule = styleSheet.rules[index] as CSSStyleRule;
        if (rule?.style) {
          Object.entries(props).forEach(([key, value]) => {
            rule.style.setProperty(key, value);
          });
        }
      };

      // Main text color
      updateStyle(0, { color: navbar.themeColor });

      // Thick horizontal lines
      updateStyle(1, { "background-color": navbar.themeColor, height: "3px" });
      updateStyle(2, { "background-color": "black", height: "3px" });

      // Thin horizontal lines
      updateStyle(3, { "background-color": navbar.themeColor, height: "1px" });
      updateStyle(4, { "background-color": "black", height: "1px" });

      // Thick vertical lines
      updateStyle(5, { "background-color": navbar.themeColor, width: "3px" });
      updateStyle(6, { "background-color": "black", width: "3px" });

      // Thin vertical lines
      updateStyle(7, { "background-color": navbar.themeColor, width: "1px" });
      updateStyle(8, { "background-color": "black", width: "1px" });

      // Link underline
      updateStyle(9, {
        "border-bottom": `1px solid ${navbar.themeColor}`,
        color: navbar.themeColor,
      });
    }
  }, [navbar.themeColor]);

  const handleClick = (event: React.MouseEvent) => {
    // Prevent event bubbling first to avoid multiple triggers
    console.log(" resume handleClick");
    event.stopPropagation();

    const target = event.target as HTMLElement;

    // Get the ID directly or from parent (more efficient approach)
    let currentElement: HTMLElement | null = target;
    let id = "";

    // Find the closest element with an ID (more efficient DOM traversal)
    while (currentElement && !id) {
      if (currentElement.id) {
        id = currentElement.id;
      }
      currentElement = currentElement.parentElement;
    }

    // If no ID found or it's the same as current chosen key, or we're in resize mode, do nothing
    if (!id || id === resume.choosenKey || resume.status.isResizable) {
      return;
    }

    // Handle previous selected element (if any)
    if (resume.choosenKey) {
      handleBlur();
      // Only update resume if really needed
      resume.updateResume();
    }

    // Update state only if necessary
    if (id !== resume.choosenKey) {
      resume.setChoosen(id);
      navbar.setBtnDisable(false);
    }

    // Handle the newly selected element
    const cur = document.getElementById(id);
    if (cur) {
      // Use a single render cycle for all DOM changes
      requestAnimationFrame(() => {
        cur.contentEditable = "true";
        cur.focus();
        if (cur.childNodes[0]) {
          const markdownText = cur.getAttribute(DATA_MARKDOWN) || "";
          (cur.childNodes[0] as HTMLElement).innerText = markdownText;
        }
      });
    }
  };

  const handleBlur = () => {
    const id = resume.choosenKey;
    if (!id) return;

    const element = document.getElementById(id);
    if (!element) return;

    // 获取当前的 Markdown 内容
    const markdownText = element.innerText;
    element.setAttribute(DATA_MARKDOWN, markdownText);

    // 渲染 Markdown 效果
    if (navbar.isMarkdownMode) {
      const [html, align] = parseMarkdown(markdownText);
      const firstChild = element.firstChild as HTMLElement;
      if (firstChild) {
        firstChild.innerHTML = html;
      }
    }

    // 设置为不可编辑
    element.contentEditable = "false";
  };

  const handleInput = () => {
    const id = resume.choosenKey;
    if (id) {
      const cur = document.getElementById(id);
      if (cur) {
        const markdownText = cur.innerText;
        cur.setAttribute(DATA_MARKDOWN, markdownText);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const id = resume.choosenKey;
    if (!id) return;

    const cur = document.getElementById(id);
    if (!cur) return;

    const value = cur.childNodes[0]
      ? (cur.childNodes[0] as HTMLElement).innerText.replace(/[\r\n]/g, "")
      : "";

    // Prevent backspace from deleting HTML when value is empty
    if (event.key === "Backspace" && value === "") {
      event.preventDefault();
    }

    // On Enter, trigger blur effect to render markdown
    if (event.key === "Enter") {
      handleBlur();
      resume.updateResume();
      navbar.setBtnDisable(true);
    }
  };

  // Only paste plain text
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  // Save layout changes in real time
  const handleLayoutChange = (layout: LayoutItem[]) => {
    resume.updateLayout(layout);
  };

  // Render grid items - use useMemo to prevent unnecessary recalculations
  const listItems = React.useMemo(() => {
    return resume.layout.map((item) => {
      // Ensure item.value is a string before passing to parseMarkdown
      const itemValue = item.value ?? "";
      const [html, align] = parseMarkdown(itemValue);

      const sectionClassName = classNames({
        [classes.hStart]: align.hStart,
        [classes.hCenter]: align.hCenter,
        [classes.hEnd]: align.hEnd,
        [classes.vStart]: align.vStart,
        [classes.vCenter]: align.vCenter,
        [classes.vEnd]: align.vEnd,
      });

      return (
        <div
          id={item.i}
          key={item.i}
          data-markdown={item.value}
          onClick={(e) => {
            handleClick(e);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInput}
          onBlur={handleBlur}
          style={resume.status.gridStyle}
          suppressContentEditableWarning={true}
        >
          <section
            className={sectionClassName}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    });
  }, [resume.layout, resume.status.gridStyle, classes]);

  // 渲染备用内容，直到布局加载完成
  if (resume.layout.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl font-bold">正在加载简历模板...</div>
          <p className="text-gray-500">这可能需要几秒钟时间</p>
        </div>
      </div>
    );
  }

  return (
    <GridLayout
      className={classes.layout}
      layout={resume.layout}
      cols={24}
      rowHeight={22}
      width={710}
      margin={[10, 2]}
      isResizable={resume.status.isResizable}
      isDraggable={resume.status.isDraggable}
      onLayoutChange={handleLayoutChange}
    >
      {listItems}
    </GridLayout>
  );
});

// Wrap the component with React.memo for extra performance
export default Resume;

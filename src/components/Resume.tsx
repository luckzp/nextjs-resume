"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItIns from "markdown-it-ins";
// @ts-ignore
import MarkdownItMark from "markdown-it-mark";
import { DATA_MARKDOWN } from "../utils/constant";
import { parseMarkdown } from "../utils/helper";
import useResumeStore from "../stores/ResumeStore";
import useNavbarStore from "../stores/NavbarStore";

// Dynamically import GridLayout with SSR disabled
const GridLayout = dynamic(() => import("react-grid-layout"), { ssr: false });

// Define the LayoutItem type to match the ResumeStore
interface LayoutItem {
  i: string;
  value: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const Resume = () => {
  // 使用选择器函数获取需要监听的具体状态，而不是整个对象
  const layout = useResumeStore((state) => state.layout);
  const status = useResumeStore((state) => state.status);
  const isAdded = useResumeStore((state) => state.isAdded);
  const choosenKey = useResumeStore((state) => state.choosenKey);

  // 获取需要的 navbar 状态
  const setBtnDisable = useNavbarStore((state) => state.setBtnDisable);

  // 保留对完整 store 的引用，用于调用方法
  const resume = useResumeStore();
  const navbar = useNavbarStore();

  const mdRef = useRef<MarkdownIt | null>(null);

  // 在组件顶部添加状态
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Initialize markdown instance and resume
  useEffect(() => {
    if (!mdRef.current) {
      const md = new MarkdownIt();
      md.use(MarkdownItIns);
      md.use(MarkdownItMark);
      mdRef.current = md;
    }

    resume.initialize();
    return () => {};
  }, []); // Run only once on mount

  // Handle style switching separately
  useEffect(() => {
    if (resume.isAdded) {
      resume.switchStyle(choosenKey, true);
    }
  }, [resume.isAdded, choosenKey]);

  const handleClick = (event: React.MouseEvent) => {
    console.log("handleClick");
    event.stopPropagation();

    const target = event.target as HTMLElement;

    // 获取 ID
    let currentElement: HTMLElement | null = target;
    let id = "";

    while (currentElement && !id) {
      if (currentElement.id) {
        id = currentElement.id;
      }
      currentElement = currentElement.parentElement;
    }

    // 如果无 ID 或与当前选中键相同，或在调整大小模式下，不执行操作
    if (!id || id === choosenKey || status.isResizable) {
      return;
    }

    // 处理之前选中的元素
    if (choosenKey) {
      resume.updateResume();
    }

    // 进入编辑模式
    resume.setChoosen(id);
    navbar.setBtnDisable(false);

    // 获取markdown文本并设置到状态
    const cur = document.getElementById(id);
    if (cur) {
      cur.focus();
      const markdownText = cur.getAttribute(DATA_MARKDOWN) || "";
      setEditingId(id);
      setEditingText(markdownText);
    }
  };

  const handleInput = () => {
    const id = choosenKey;
    if (id) {
      const cur = document.getElementById(id);
      if (cur) {
        const markdownText = cur.innerText;
        cur.setAttribute(DATA_MARKDOWN, markdownText);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Get current element and its text content
    console.log("handleKeyDown");
    if (editingId) {
      const cur = document.getElementById(editingId);
      if (cur) {
        const value =
          cur.querySelector("section")?.innerText.replace(/[\r\n]/g, "") || "";

        // Prevent deleting HTML structure when content is empty and backspace is pressed
        if (event.key === "Backspace" && value === "") {
          event.preventDefault();
        }

        // 在编辑模式下处理Enter键
        if (event.key === "Enter") {
          console.log("enter");
          resume.updateResume();
          navbar.setBtnDisable(true);
        }
      }
    }
  };

  // Only paste plain text
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  const handleLayoutChange = (layout: LayoutItem[]) => {
    resume.updateLayout(layout);
  };

  // Render grid items - use useMemo to prevent unnecessary recalculations
  const listItems = React.useMemo(() => {
    return layout.map((item) => {
      const itemValue = item.value ?? "";
      const [html, align] = parseMarkdown(itemValue);

      const sectionClassName = classNames({
        "justify-start": align.hStart,
        "justify-center": align.hCenter,
        "justify-end": align.hEnd,
        "items-start": align.vStart,
        "items-center": align.vCenter,
        "items-end": align.vEnd,
      });

      // 判断是否在编辑模式
      const isEditing = editingId === item.i;

      return (
        <div
          id={item.i}
          key={item.i}
          data-markdown={item.value}
          onClick={handleClick}
          onPaste={handlePaste}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          style={status.gridStyle}
          className="resume-content"
          suppressContentEditableWarning={true}
        >
          {isEditing ? (
            // 编辑模式显示纯文本输入框
            <section
              className={`flex h-full w-full overflow-hidden text-[3.8mm] leading-6 ${sectionClassName}`}
              suppressContentEditableWarning={true}
            >
              {editingText}
            </section>
          ) : (
            // 预览模式显示渲染后的HTML
            <section
              className={`flex h-full w-full overflow-hidden text-[3.8mm] leading-6 ${sectionClassName}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      );
    });
  }, [layout, status, choosenKey, editingId, editingText]); // 添加 status 作为依赖

  return (
    <>
      <GridLayout
        className="w-[188mm]"
        layout={layout}
        cols={24}
        rowHeight={22}
        width={710}
        margin={[10, 2]}
        isResizable={status.isResizable}
        isDraggable={status.isDraggable}
        onLayoutChange={handleLayoutChange}
      >
        {listItems}
      </GridLayout>
    </>
  );
};

// Wrap the component with React.memo for extra performance
export default Resume;

"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItIns from "markdown-it-ins";
// @ts-ignore
import MarkdownItMark from "markdown-it-mark";
import { DATA_ORIGIN } from "../utils/constant";
import useResumeStore from "../stores/ResumeStore";
import useNavbarStore from "../stores/NavbarStore";

// Dynamically import GridLayout with SSR disabled
const GridLayout = dynamic(() => import("react-grid-layout"), { ssr: false });

// Define the NormalResume component
const NormalResume: React.FC = () => {
  const layout = useResumeStore((state) => state.layout);
  const status = useResumeStore((state) => state.status);
  const isAdded = useResumeStore((state) => state.isAdded);
  const choosenKey = useResumeStore((state) => state.choosenKey);

  // 获取需要的 navbar 状态
  const setBtnDisable = useNavbarStore((state) => state.setBtnDisable);

  const resume = useResumeStore();
  const navbar = useNavbarStore();
  const mdRef = useRef<MarkdownIt | null>(null);

  // Initialize Markdown parser
  useEffect(() => {
    if (!mdRef.current) {
      const md = new MarkdownIt();
      md.use(MarkdownItIns);
      md.use(MarkdownItMark);
      mdRef.current = md;
    }
    resume.initialize();
  }, []);

  // Handle clicking on a grid item
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const id = target.id ? target.id : (target.offsetParent as HTMLElement).id;

    // Don't process the click event if in content edit state or grid state
    if (id === choosenKey || status.isResizable) {
      return;
    }

    // Different item clicked
    if (choosenKey) {
      console.log(choosenKey);
      resume.updateNormalResume();
    }

    resume.setChoosen(id);
    navbar.setBtnDisable(false);

    const currentElement = document.getElementById(id);
    currentElement?.focus();
  };

  // Prevent line breaks and handle key presses
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const id = resume.choosenKey;
    const currentElement = document.getElementById(id);

    if (!currentElement) return;

    const section = currentElement.childNodes[0] as HTMLElement;
    const value = section.innerText.replace(/[\r\n]/g, "");

    // Backspace - prevent deleting the HTML structure
    if (event.key === "Backspace" && value === "") {
      event.preventDefault();
    }

    // Enter - save changes and disable editing
    if (event.key === "Enter") {
      resume.updateNormalResume();
      navbar.setBtnDisable(true);
    }
  };

  // Update the original content when input changes
  const handleInput = () => {
    const id = resume.choosenKey;
    if (!id) return;

    const currentElement = document.getElementById(id);
    if (!currentElement) return;

    const section = currentElement.childNodes[0] as HTMLElement;
    currentElement.setAttribute(DATA_ORIGIN, section.innerHTML);
  };

  // Only paste plain text
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  // Save layout changes
  const handleLayoutChange = (layout: any[]) => {
    resume.updateLayout(layout);
  };

  // Handle newly added grid item styling
  useEffect(() => {
    if (resume.isAdded) {
      const id = resume.choosenKey;
      const element = document.getElementById(id);
      if (!element) return;

      // The space in the middle is important - for replacement and to avoid self-closing tags
      const content = "<section> </section>";

      if (element.childNodes[0]) {
        (element.childNodes[0] as HTMLElement).innerHTML = content;
      }

      element.setAttribute(DATA_ORIGIN, content);
      resume.switchStyle(id, true);
      resume.setAdded(false);
    }
  }, [resume.isAdded]);

  return (
    <GridLayout
      className="resume-layout w-[188mm]"
      layout={layout}
      cols={24}
      rowHeight={22}
      width={710}
      margin={[10, 2]}
      isResizable={status.isResizable}
      isDraggable={status.isDraggable}
      onLayoutChange={handleLayoutChange}
    >
      {layout.map((item) => (
        <div
          id={item.i}
          key={item.i}
          data-origin={item.origin}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInput}
          style={status.gridStyle}
          className="resume-content"
          suppressContentEditableWarning={true}
        >
          <section dangerouslySetInnerHTML={{ __html: item.origin || "" }} />
        </div>
      ))}
    </GridLayout>
  );
};

export default NormalResume;

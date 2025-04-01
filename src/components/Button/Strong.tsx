"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Image from "next/image";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useNavbarStore, useResumeStore, useHintStore } from "../../stores";

const Strong = () => {
  const navbar = useNavbarStore();
  const resume = useResumeStore();
  const hint = useHintStore();
  const [currentSelection, setCurrentSelection] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()?.toString() || "";
      setCurrentSelection(selection);
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  /**
   * Updates markdown style
   */
  const updateStyle = (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = resume.choosenKey;
    const { isMarkdownMode } = navbar;

    if (isMarkdownMode) {
      updateMarkdown(id);
    } else {
      updateNormal(id);
    }
  };

  const updateMarkdown = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";
    const selectValue = currentSelection;
    console.log("selectValue", selectValue);
    if (selectValue) {
      const index = content.indexOf(selectValue);
      content =
        content.slice(0, index) +
        "**" +
        selectValue +
        "**" +
        content.slice(index + selectValue.length);
    } else {
      content = `${content}****`;
    }

    // Update markdown content
    if (element.childNodes[0]) {
      (element.childNodes[0] as Element).innerHTML = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";
    const selectValue = currentSelection;

    if (selectValue) {
      const index = content.indexOf(selectValue);
      if (index === -1) {
        hint.setError({
          isOpen: true,
          message: "加粗位置请不要与其他加粗、主题色和链接位置重合",
        });
        return;
      }

      content =
        content.slice(0, index) +
        "<strong>" +
        selectValue +
        "</strong>" +
        content.slice(index + selectValue.length);

      // Check if childNode is an Element before setting innerHTML
      const childNode = element.childNodes[0];
      if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
        (childNode as Element).innerHTML = content;
      } else if (childNode) {
        // If not an element, replace with a new element
        const newElement = document.createElement("span");
        newElement.innerHTML = content;
        element.replaceChild(newElement, childNode);
      }

      element.setAttribute(DATA_ORIGIN, content);
    } else {
      hint.setError({
        isOpen: true,
        message: "请选择文本",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={ENTER_DELAY}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            disabled={navbar.isDisabled}
            onClick={updateStyle}
            className="min-w-0 rounded-none border-b border-r border-t border-[#cccccc] px-2.5 disabled:opacity-30"
          >
            <Image
              src="/icons/bold.svg"
              alt="加粗"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>加粗</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Strong;

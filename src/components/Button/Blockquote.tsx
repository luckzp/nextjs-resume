"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import Image from "next/image";
import * as cheerio from "cheerio";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useNavbarStore, useResumeStore } from "../../stores";

const Blockquote = () => {
  const { isDisabled, isMarkdownMode } = useNavbarStore();
  const { choosenKey } = useResumeStore();

  /**
   * Updates the style based on the current mode (markdown or normal)
   */
  const updateStyle = (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = choosenKey;

    if (isMarkdownMode) {
      updateMarkdown(id);
    } else {
      updateNormal(id);
    }
  };

  /**
   * Updates the content in markdown mode
   */
  const updateMarkdown = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";
    content = "> " + content;

    // Update markdown content
    if (element.childNodes[0]) {
      element.childNodes[0].textContent = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  /**
   * Updates the content in normal mode
   */
  const updateNormal = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";

    // Use Cheerio to parse and manipulate HTML content
    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const section = $.html();
    const sectionInner = $("section").html() || "";

    let newContent: string;

    if ($("section u").html()) {
      // If already has an underline, use its content
      const sectionTitle = $("section u").html() || "";
      newContent = section.replace(sectionInner, `${sectionTitle}`);
    } else {
      // Create a new underline with the current content
      const sectionTitle = $("section").html() || "";
      newContent = section.replace(sectionInner, `<u>${sectionTitle}</u>`);
    }

    // Update HTML content
    const childNode = element.childNodes[0];
    if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
      (childNode as Element).innerHTML = newContent;
    } else if (childNode) {
      // If not an element, replace with a new element
      const newElement = document.createElement("span");
      newElement.innerHTML = newContent;
      element.replaceChild(newElement, childNode);
    }

    element.setAttribute(DATA_ORIGIN, newContent);
  };

  return (
    <TooltipProvider delayDuration={ENTER_DELAY}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className=" rounded-none border-b border-r border-t border-[#cccccc] p-0 disabled:opacity-30"
            disabled={isDisabled}
            onClick={updateStyle}
          >
            <Image
              src="/icons/underline.svg"
              alt="下划线"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>下划线</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Blockquote;

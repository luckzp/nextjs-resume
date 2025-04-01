"use client";

import React from "react";
import Image from "next/image";
import * as cheerio from "cheerio";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useNavbarStore, useResumeStore } from "../../stores";

const Li = () => {
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
    content = "- " + content;

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

    if ($("section ul li").html()) {
      // If already has a list item, use its content
      const sectionTitle = $("section ul li").html() || "";
      newContent = section.replace(sectionInner, `${sectionTitle}`);
    } else {
      // Create a new list with the current content
      const sectionTitle = $("section").html() || "";
      newContent = section.replace(
        sectionInner,
        `<ul><li>${sectionTitle}</li></ul>`,
      );
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
            className=" rounded-none border-y border-l-0 border-r border-[#cccccc] p-[6px_10px] disabled:opacity-30"
            disabled={isDisabled}
            onClick={updateStyle}
          >
            <Image
              src="/icons/list.svg"
              alt="列表"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={5}>
          <p>列表</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Li;

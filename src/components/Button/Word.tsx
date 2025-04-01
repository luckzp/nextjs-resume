"use client";

import React from "react";
import Image from "next/image";
import * as cheerio from "cheerio";
import { DATA_MARKDOWN, DATA_ORIGIN } from "../../utils/constant";
import { useNavbarStore, useResumeStore } from "../../stores";
import { cn } from "../../lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const Word = () => {
  const navbar = useNavbarStore();
  const resume = useResumeStore();

  /**
   * Update text style
   */
  const updateStyle = (flag: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const id = resume.choosenKey;
    const { isMarkdownMode } = navbar;

    if (isMarkdownMode) {
      updateMarkdown(id, flag);
    } else {
      updateNormal(id, flag);
    }
  };

  const updateMarkdown = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_MARKDOWN) || "";

    if (flag === "h1") {
      content = "# " + content;
    } else if (flag === "h2") {
      content = "## " + content;
    }

    if (element.childNodes[0]) {
      element.childNodes[0].textContent = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";

    // Process content with cheerio to handle HTML
    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const section = $.html();
    const sectionInner = $("section").html() || "";

    let sectionTitle;
    if ($("section h1").html()) {
      sectionTitle = $("section h1").html();
    } else if ($("section h2").html()) {
      sectionTitle = $("section h2").html();
    } else {
      sectionTitle = $("section").html();
    }

    if (flag === "h1") {
      content = section.replace(sectionInner, `<h1>${sectionTitle}</h1>`);
    } else if (flag === "h2") {
      content = section.replace(sectionInner, `<h2>${sectionTitle}</h2>`);
    } else if (flag === "p") {
      content = section.replace(sectionInner, `${sectionTitle}`);
    }

    // Update content
    const childNode = element.childNodes[0];
    if (childNode && childNode.nodeType === Node.ELEMENT_NODE) {
      (childNode as Element).innerHTML = content;
    }
    element.setAttribute(DATA_ORIGIN, content);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-full items-center p-[6px_10px] text-[#555]",
            "relative min-w-[auto] border border-[#cccccc]",
            "rounded-l-[3px]",
            "hover:bg-accent",
            navbar.isDisabled && "opacity-30",
          )}
          disabled={navbar.isDisabled}
          onClick={(e) => e.stopPropagation()}
          aria-label="字号切换"
        >
          <Image
            src="/icons/word.svg"
            alt="字号切换"
            width={24}
            height={24}
            priority
          />
          <Image
            src="/icons/corner.svg"
            alt="corner"
            width={10}
            height={10}
            className="absolute bottom-[2px] right-[2px]"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="mt-1 text-[0.95em]">
        <DropdownMenuItem
          onClick={(e) => updateStyle("p", e)}
          className={cn(navbar.isMarkdownMode && "hidden")}
        >
          普通字号
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => updateStyle("h1", e)}>
          一级标题
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => updateStyle("h2", e)}>
          二级标题
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Word;

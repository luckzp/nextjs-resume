"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as cheerio from "cheerio";

import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";
import { useNavbarStore, useResumeStore } from "../../stores";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const Align: React.FC = () => {
  const { choosenKey } = useResumeStore();
  const { isDisabled, isMarkdownMode } = useNavbarStore();

  /**
   * Update alignment style
   */
  const updateStyle =
    (flag: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const id = choosenKey;

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

    if (flag === "hStart") {
      content = content + "[-S]";
    } else if (flag === "hCenter") {
      content = content + "[-C]";
    } else if (flag === "hEnd") {
      content = content + "[-E]";
    } else if (flag === "vStart") {
      content = content + "[+S]";
    } else if (flag === "vCenter") {
      content = content + "[+C]";
    } else if (flag === "vEnd") {
      content = content + "[+E]";
    }

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerText = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with id ${id} not found`);
      return;
    }

    // 获取原始内容
    let content = element.getAttribute(DATA_ORIGIN) || "";

    // 使用cheerio解析内容
    let $ = cheerio.load(content, {
      xmlMode: true,
    });

    // 获取内容并创建带对齐类的新section
    const sectionInner = $("section").html() || "";
    content = `<section class="${flag}">${sectionInner}</section>`;

    // 更新DOM
    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerHTML = content;
    } else {
      element.innerHTML = content;
    }
    console.log(content);
    // 保存更新后的内容
    element.setAttribute(DATA_ORIGIN, content);
  };

  return (
    <TooltipProvider delayDuration={ENTER_DELAY}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={isDisabled}
                className=" rounded-none border-y border-r border-gray-300"
              >
                <Image
                  src="/icons/align.svg"
                  alt="align icon"
                  width={24}
                  height={24}
                />
                <Image
                  src="/icons/corner.svg"
                  alt="corner icon"
                  width={12}
                  height={12}
                  className="absolute bottom-0.5 right-0.5"
                />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">对齐</TooltipContent>
          <DropdownMenuContent className="mt-2">
            <DropdownMenuItem onClick={updateStyle("hStart")}>
              左对齐
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateStyle("hCenter")}>
              水平居中
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateStyle("hEnd")}>
              右对齐
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateStyle("vStart")}>
              上对齐
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateStyle("vCenter")}>
              垂直居中
            </DropdownMenuItem>
            <DropdownMenuItem onClick={updateStyle("vEnd")}>
              下对齐
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Align;

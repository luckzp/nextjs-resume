import React, { useState } from "react";
import Image from "next/image";
import * as cheerio from "cheerio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN,
} from "../../utils/constant";

import { useNavbarStore, useResumeStore } from "../../stores";

const Line: React.FC = () => {
  const { isDisabled, isMarkdownMode } = useNavbarStore();
  const { choosenKey } = useResumeStore();

  /**
   * Update line style
   */
  const addLine = (flag: string) => (event: React.MouseEvent<HTMLElement>) => {
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

    if (flag === "h") {
      content = "---";
    } else if (flag === "v") {
      content = "+++";
    }
    if (flag === "H") {
      content = "---";
    } else if (flag === "strongH") {
      content = "**---**";
    } else if (flag === "colorH") {
      content = "`---`";
    } else if (flag === "strongColorH") {
      content = "**`---`**";
    } else if (flag === "V") {
      content = "+++";
    } else if (flag === "strongV") {
      content = "**+++**";
    } else if (flag === "colorV") {
      content = "`+++`";
    } else if (flag === "strongColorV") {
      content = "**`+++`**";
    }

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerText = content;
    }
    element.setAttribute(DATA_MARKDOWN, content);
  };

  const updateNormal = (id: string, flag: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    let content = element.getAttribute(DATA_ORIGIN) || "";

    const $ = cheerio.load(content, {
      xmlMode: true,
    });

    const section = $.html();
    const sectionInner = $("section").html() || "";
    let html;

    if (flag === "H") {
      html = "<ins><hr></ins>";
    } else if (flag === "strongH") {
      html = "<strong><ins><hr></ins></strong>";
    } else if (flag === "colorH") {
      html = "<code><ins><hr></ins></code>";
    } else if (flag === "strongColorH") {
      html = "<strong><code><ins><hr></ins></code></strong>";
    } else if (flag === "V") {
      html = "<mark><hr></mark>";
    } else if (flag === "strongV") {
      html = "<strong><mark><hr></mark></strong>";
    } else if (flag === "colorV") {
      html = "<code><mark><hr></mark></code>";
    } else if (flag === "strongColorV") {
      html = "<strong><code><mark><hr></mark></code></strong>";
    }

    content = section.replace(sectionInner || "", html || "");

    if (element.childNodes[0]) {
      (element.childNodes[0] as HTMLElement).innerHTML = content;
    }
    element.setAttribute(DATA_ORIGIN, content);
  };

  return (
    <div>
      <TooltipProvider delayDuration={ENTER_DELAY}>
        <Tooltip>
          <DropdownMenu modal={false}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isDisabled}
                  className={`rounded-none border-0 border-b border-r border-t border-[#cccccc] px-2.5 py-1.5 ${isDisabled ? "opacity-30" : ""}`}
                >
                  <Image
                    src="/icons/line.svg"
                    alt="line icon"
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
            <TooltipContent side="bottom">
              <p>分割线</p>
            </TooltipContent>
            <DropdownMenuContent className="mt-1">
              <DropdownMenuItem className="text-sm" onClick={addLine("H")}>
                横线
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={addLine("strongH")}
              >
                加粗横线
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={addLine("colorH")}>
                主题色横线
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={addLine("strongColorH")}
              >
                加粗主题色横线
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={addLine("V")}>
                竖线
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={addLine("strongV")}
              >
                加粗竖线
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={addLine("colorV")}>
                主题色竖线
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm"
                onClick={addLine("strongColorV")}
              >
                加粗主题色竖线
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Line;

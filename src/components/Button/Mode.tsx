"use client";
import React from "react";
import Image from "next/image";
import useNavbarStore from "../../stores/NavbarStore";
import useHintStore from "../../stores/HintStore";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { MARKDOWN_MODE } from "../../utils/constant";

const Mode: React.FC = () => {
  const isMarkdownMode = useNavbarStore((state) => state.isMarkdownMode);
  const setMarkdownMode = useNavbarStore((state) => state.setMarkdownMode);
  const setSuccess = useHintStore((state) => state.setSuccess);

  const switchMode = (value: boolean) => {
    setMarkdownMode(value);
    window.localStorage.setItem(MARKDOWN_MODE, String(value));
    setSuccess({
      isOpen: true,
      message: "已切换。提示：两种模式简历独立。",
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative text-[#555]",
            "rounded-l-none rounded-r-[3px]",
          )}
          aria-label="切换模式"
        >
          {isMarkdownMode ? "MD" : "普通"}
          <div className="absolute bottom-[2px] right-[2px]">
            <Image src="/icons/corner.svg" alt="logo" width={10} height={10} />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="mt-1 w-[100px] text-[0.95em]"
      >
        <DropdownMenuItem onClick={() => switchMode(true)}>
          Markdown模式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchMode(false)}>
          普通模式
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Mode;

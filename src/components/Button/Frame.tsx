"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import {
  COLOR_RESIZABLE,
  COLOR_NORMAL,
  ENTER_DELAY,
  LEAVE_DELAY,
} from "../../utils/constant";
import useResumeStore from "../../stores/ResumeStore";
import useNavbarStore from "../../stores/NavbarStore";

const Frame = () => {
  const isMarkdownMode = useNavbarStore((state) => state.isMarkdownMode);
  const status = useResumeStore((state) => state.status);
  const setStatus = useResumeStore((state) => state.setStatus);

  const toggleStatus = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Toggle the resizable state
    if (status.isResizable) {
      const newStatus = {
        gridStyle: { background: COLOR_NORMAL },
        isResizable: false,
        isDraggable: false,
      };
      setStatus(newStatus, isMarkdownMode);
    } else {
      const newStatus = {
        gridStyle: { background: COLOR_RESIZABLE },
        isResizable: true,
        isDraggable: true,
      };
      setStatus(newStatus, isMarkdownMode);
    }
  };

  return (
    <TooltipProvider delayDuration={ENTER_DELAY}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={` rounded-none rounded-l-sm border border-[#cccccc] px-2.5 py-1.5 ${
              status.isResizable ? "bg-[rgba(56,132,255,.1)]" : ""
            }`}
            onClick={toggleStatus}
          >
            <Image
              src="/icons/frame.svg"
              alt="排版"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>排版</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Frame;

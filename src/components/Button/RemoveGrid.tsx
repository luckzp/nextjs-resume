"use client";

import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";
import useResumeStore from "../../stores/ResumeStore";
import useNavbarStore from "../../stores/NavbarStore";

/**
 * RemoveGrid Component - Allows removing a grid from the resume layout
 */
const RemoveGrid = () => {
  const removeGrid = useResumeStore((state) => state.removeGrid);
  const isDisabled = useNavbarStore((state) => state.isDisabled);

  const handleRemoveGrid = () => {
    removeGrid();
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={ENTER_DELAY}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleRemoveGrid}
            disabled={isDisabled}
            variant="outline"
            className="rounded-none rounded-r-sm border-y border-r border-[#cccccc] p-[6px_10px] disabled:opacity-30"
          >
            <Image
              src="/icons/remove.svg"
              alt="Remove grid"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>删除网格</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RemoveGrid;

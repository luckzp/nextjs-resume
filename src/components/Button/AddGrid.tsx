"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import { ENTER_DELAY, LEAVE_DELAY, ITEM_MAX_NUMS } from "../../utils/constant";
import useResumeStore from "../../stores/ResumeStore";
import useNavbarStore from "../../stores/NavbarStore";

/**
 * AddGrip Component - Allows adding a new grid to the resume layout
 */
const AddGrip = () => {
  const { toast } = useToast();
  const layout = useResumeStore((state) => state.layout);
  const addGrid = useResumeStore((state) => state.addGrid);
  const isMarkdownMode = useNavbarStore((state) => state.isMarkdownMode);
  const setBtnDisable = useNavbarStore((state) => state.setBtnDisable);

  const handleAddGrid = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (layout.length >= ITEM_MAX_NUMS) {
      toast({
        variant: "destructive",
        title: "网格过多",
        duration: 5000,
      });
    } else {
      addGrid(isMarkdownMode);
      setBtnDisable(false);
    }
  };

  return (
    <TooltipProvider delayDuration={ENTER_DELAY}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleAddGrid}
            variant="outline"
            size="icon"
            className=" min-w-0 rounded-none border-b border-r border-t border-[#cccccc] px-2 py-1.5"
          >
            <Image
              src="/icons/add.svg"
              alt="Add grid"
              width={24}
              height={24}
              priority
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>新增网格</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddGrip;

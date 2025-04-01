"use client";
import React from "react";
import Image from "next/image";
import useNavbarStore from "../../stores/NavbarStore";
import useDialogStore from "../../stores/DialogStore";
import { TEMPLATE_NUM } from "../../utils/constant";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const ENTER_DELAY = 200;
const LEAVE_DELAY = 0;

const Change: React.FC = () => {
  // 使用zustand hooks
  const templateNum = useNavbarStore((state) => state.templateNum);
  const setTemplateNum = useNavbarStore((state) => state.setTemplateNum);
  const setChangeOpened = useDialogStore((state) => state.setChangeOpened);
  const handleTemplateSwitch = (value: number) => {
    setTemplateNum(value);
    localStorage.setItem(TEMPLATE_NUM, value.toString());
    setChangeOpened(true);
  };

  const message = templateNum === 0 ? "自定义" : `模板${templateNum}`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative min-w-[auto] text-[#555]",
            "rounded-l-[3px] rounded-r-none",
          )}
          aria-label="切换模板"
        >
          {message}
          <Image
            src="/icons/corner.svg"
            alt="corner"
            width={10}
            height={10}
            className="absolute bottom-[2px] right-[2px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="mt-1 text-[0.95em]">
        <DropdownMenuItem onClick={() => handleTemplateSwitch(1)}>
          模板1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTemplateSwitch(2)}>
          模板2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTemplateSwitch(3)}>
          模板3
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTemplateSwitch(4)}>
          模板4
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTemplateSwitch(0)}>
          自定义
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Change;

import React, { useState, MouseEvent, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Maximize2 } from "lucide-react";
import { fullScreen, exitFullScreen } from "../../utils/helper";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";

const Screen = () => {
  const [isScreenActive, setIsScreenActive] = useState(false);

  const toggleScreen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsScreenActive(!isScreenActive);
  };

  useEffect(() => {
    if (isScreenActive) {
      fullScreen();
    } else {
      exitFullScreen();
    }
  }, [isScreenActive]);

  return (
    <TooltipProvider delayDuration={ENTER_DELAY}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-none border-b border-r border-t border-[#cccccc] p-0",
              isScreenActive && "bg-blue-50",
            )}
            onClick={toggleScreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>全屏</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Screen;

"use client";

import React from "react";
import { Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import {
  COLOR_RESIZABLE,
  COLOR_NORMAL,
  ENTER_DELAY,
  LEAVE_DELAY,
} from "../../utils/constant";
import { useStore } from "../../stores";

// Define styled components using @mui/material's styled API
const FrameButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  padding: "6px 10px",
  border: "1px solid #cccccc",
  borderRadius: "0",
  borderTopLeftRadius: "3px",
  borderBottomLeftRadius: "3px",
  height: "100%",
  minWidth: "auto",
  ...(isActive && {
    background: "rgba(56,132,255,.1)",
  }),
}));

const Frame = () => {
  const { navbar, resume } = useStore();

  const toggleStatus = (event: React.MouseEvent) => {
    event.stopPropagation();
    const { isMarkdownMode } = navbar;

    // Toggle the resizable state
    if (resume.status.isResizable) {
      const status = {
        gridStyle: { background: COLOR_NORMAL },
        isResizable: false,
        isDraggable: false,
      };
      resume.setStatus(status, isMarkdownMode);
    } else {
      const status = {
        gridStyle: { background: COLOR_RESIZABLE },
        isResizable: true,
        isDraggable: true,
      };
      resume.setStatus(status, isMarkdownMode);
    }
  };

  return (
    <Tooltip
      title="排版"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <FrameButton isActive={resume.status.isResizable} onClick={toggleStatus}>
        <Image
          src="/icons/frame.svg"
          alt="排版"
          width={24}
          height={24}
          priority
        />
      </FrameButton>
    </Tooltip>
  );
};

export default observer(Frame);

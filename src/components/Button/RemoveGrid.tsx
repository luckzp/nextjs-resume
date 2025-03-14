"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";
import { useStore } from "../../stores";

// Styled components
const StyledButton = styled(Button)(({ theme }) => ({
  padding: "6px 10px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",
  height: "100%",
  minWidth: "auto",
  "&.Mui-disabled": {
    opacity: 0.3,
  },
}));

/**
 * RemoveGrid Component - Allows removing a grid from the resume layout
 */
const RemoveGrid = observer(() => {
  const { resume, navbar } = useStore();

  const handleRemoveGrid = () => {
    resume.removeGrid();
  };

  return (
    <Tooltip
      title="删除网格"
      placement="bottom"
      enterDelay={ENTER_DELAY}
      leaveDelay={LEAVE_DELAY}
      disableFocusListener
    >
      <span>
        <StyledButton onClick={handleRemoveGrid} disabled={navbar.isDisabled}>
          <Image
            src="/icons/remove.svg"
            alt="Remove grid"
            width={24}
            height={24}
            priority
          />
        </StyledButton>
      </span>
    </Tooltip>
  );
});

export default RemoveGrid;

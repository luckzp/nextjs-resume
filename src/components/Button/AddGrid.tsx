"use client";

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import { ENTER_DELAY, LEAVE_DELAY, ITEM_MAX_NUMS } from "../../utils/constant";
import Hint from "../Basic/Hint";
import { useStore } from "../../stores";

// Styled components
const StyledButton = styled(Button)(({ theme }) => ({
  padding: "6px 8px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  height: "100%",
  minWidth: "auto",
}));

/**
 * AddGrip Component - Allows adding a new grid to the resume layout
 */
const AddGrip = observer(() => {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const { resume, navbar } = useStore();

  const handleAddGrid = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (resume.layout.length >= ITEM_MAX_NUMS) {
      setIsHintOpen(true);
    } else {
      resume.addGrid(navbar.isMarkdownMode);
      navbar.setBtnDisable(false);
    }
  };

  const handleCloseHint = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsHintOpen(false);
  };

  return (
    <div>
      <Tooltip
        title="新增网格"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <StyledButton onClick={handleAddGrid}>
          <Image
            src="/icons/add.svg"
            alt="Add grid"
            width={24}
            height={24}
            priority
          />
        </StyledButton>
      </Tooltip>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={isHintOpen}
        autoHideDuration={5000}
        onClose={handleCloseHint}
      >
        <Hint onClose={handleCloseHint} variant="error" message="网格过多" />
      </Snackbar>
    </div>
  );
});

export default AddGrip;

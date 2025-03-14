"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

import { ENTER_DELAY, LEAVE_DELAY, MARKDOWN_MODE } from "../../utils/constant";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "0px 10px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",
  height: "100%",
  color: "#555",
  minWidth: "auto",
}));

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    top: "40px !important",
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.95em",
});

const Mode: React.FC = observer(() => {
  const { navbar, hint } = useStore();
  const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null);
  const modeOpen = Boolean(modeAnchorEl);

  const openModeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setModeAnchorEl(event.currentTarget);
  };

  const closeModeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setModeAnchorEl(null);
  };

  const switchMode =
    (value: boolean) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setModeAnchorEl(null);
      navbar.setMarkdownMode(value);
      window.localStorage.setItem(MARKDOWN_MODE, String(value));
      hint.setSuccess({
        isOpen: true,
        message: "已切换。提示：两种模式简历独立。",
      });
    };

  return (
    <>
      <Tooltip
        title="切换模式"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
      >
        <StyledButton onClick={openModeMenu}>
          {navbar.isMarkdownMode ? "MD" : "普通"}
          <div style={{ position: "absolute", bottom: 2, right: 2 }}>
            <Image src="/icons/corner.svg" alt="logo" width={10} height={10} />
          </div>
        </StyledButton>
      </Tooltip>

      <StyledMenu
        id="template-menu"
        anchorEl={modeAnchorEl}
        open={modeOpen}
        onClose={closeModeMenu}
        disableScrollLock={true}
      >
        <StyledMenuItem style={{ display: "none" }} />
        <StyledMenuItem onClick={switchMode(true)}>Markdown模式</StyledMenuItem>
        <StyledMenuItem onClick={switchMode(false)}>普通模式</StyledMenuItem>
      </StyledMenu>
    </>
  );
});

export default Mode;

"use client";

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { BlockPicker } from "react-color";

import navbarStore from "../../stores/NavbarStore";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "6px 10px",
  borderRadius: "0",
  borderBottom: "1px solid #cccccc",
  borderTop: "1px solid #cccccc",
  borderRight: "1px solid #cccccc",
  height: "100%",
  minWidth: "auto",
}));

const ColorMenuPaper = styled("div")({
  "& .MuiPaper-root": {
    top: "40px !important",
  },
  "& ul": {
    padding: 0,
  },
});

const CornerImage = styled("img")({
  position: "absolute",
  bottom: 2,
  right: 2,
});

const Color = () => {
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const colorOpen = Boolean(colorAnchorEl);

  const openColorMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setColorAnchorEl(event.currentTarget);
  };

  const colorClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setColorAnchorEl(null);
  };

  const handleThemeColor = (color: { hex: string }) => {
    navbarStore.setThemeColor(color.hex);
  };

  return (
    <div>
      <Tooltip
        title="主题颜色"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <StyledButton onClick={openColorMenu}>
          <img src="/icons/color.svg" alt="color" />
          <CornerImage src="/icons/corner.svg" alt="corner" />
        </StyledButton>
      </Tooltip>

      {/* 颜色选择器菜单 */}
      <Menu
        id="color-menu"
        anchorEl={colorAnchorEl}
        open={colorOpen}
        onClose={colorClose}
        component={ColorMenuPaper}
      >
        <BlockPicker
          color={navbarStore.themeColor}
          onChangeComplete={handleThemeColor}
          colors={["#468CD4", "#F47373", "#697689", "#ba68c8", "#000000"]}
          triangle="hide"
        />
      </Menu>
    </div>
  );
};

export default observer(Color);

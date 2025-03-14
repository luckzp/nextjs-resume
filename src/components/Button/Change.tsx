"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { TEMPLATE_NUM } from "../../utils/constant";

const ENTER_DELAY = 200;
const LEAVE_DELAY = 0;

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "0px 10px",
  border: "1px solid #cccccc",
  borderRadius: "0",
  borderTopLeftRadius: "3px",
  borderBottomLeftRadius: "3px",
  height: "100%",
  color: "#555",
  minWidth: "auto",
}));

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.95em",
});

const Change: React.FC = observer(() => {
  const { navbar } = useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleTemplateSwitch = (value: number) => (event: React.MouseEvent) => {
    event.stopPropagation();
    navbar.setTemplateNum(value);
    localStorage.setItem(TEMPLATE_NUM, value.toString());
    setAnchorEl(null);
  };

  const handleChangeDialogOpen = () => {
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const message =
    navbar.templateNum === 0 ? "自定义" : `模板${navbar.templateNum}`;

  return (
    <div>
      <Tooltip
        title="切换模板"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
        disableFocusListener
      >
        <StyledButton onClick={handleClick}>
          {message}
          <Image
            src="/icons/corner.svg"
            alt="corner"
            width={10}
            height={10}
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
            }}
          />
        </StyledButton>
      </Tooltip>

      <Menu
        id="template-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            top: "40px !important",
          },
        }}
        disableScrollLock={true}
      >
        <StyledMenuItem sx={{ display: "none" }} />
        <StyledMenuItem onClick={handleTemplateSwitch(1)}>模板1</StyledMenuItem>
        <StyledMenuItem onClick={handleTemplateSwitch(2)}>模板2</StyledMenuItem>
        <StyledMenuItem onClick={handleTemplateSwitch(3)}>模板3</StyledMenuItem>
        <StyledMenuItem onClick={handleTemplateSwitch(4)}>模板4</StyledMenuItem>
        <StyledMenuItem onClick={handleTemplateSwitch(0)}>
          自定义
        </StyledMenuItem>
      </Menu>
    </div>
  );
});

export default Change;

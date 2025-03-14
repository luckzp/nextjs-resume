"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

import { ENTER_DELAY, LEAVE_DELAY, STORAGE_LAYOUT } from "../../utils/constant";
import { downloadFile } from "../../utils/helper";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "0px 10px",
  height: "100%",
  width: "200px",
}));

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    top: "40px !important",
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.95em",
});

const InputLabel = styled("label")({
  width: "100%",
  height: "100%",
});

const HiddenInput = styled("input")({
  display: "none",
});

const Export: React.FC = () => {
  const { navbar, hint } = useStore();
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const exportOpen = Boolean(exportAnchorEl);

  const openModeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setExportAnchorEl(event.currentTarget);
  };

  const closeModeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setExportAnchorEl(null);
  };

  const handleExport = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log("Export button clicked, setting isExported to true");
    navbar.setExported(true);
    console.log("isExported set to:", navbar.isExported);
    setExportAnchorEl(null);

    hint.setSuccess({
      isOpen: true,
      message: "正在导出为PDF...",
    });
  };

  const saveToLocal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const layout = window.localStorage.getItem(STORAGE_LAYOUT);
    if (layout) {
      const filename = `markdown-resume-${new Date().getTime()}.json`;
      downloadFile(filename, layout);

      hint.setSuccess({
        isOpen: true,
        message: "已保存到本地",
      });
    }
    setExportAnchorEl(null);
  };

  const importFromLocal = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const content = fileReader.result as string;
        window.localStorage.setItem(STORAGE_LAYOUT, content);
        window.location.href = "/";
      };
      fileReader.readAsText(file);
    }
    setExportAnchorEl(null);
  };

  const openHelpDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    // Display help information using the hint store
    hint.setSuccess({
      isOpen: true,
      message: "帮助信息已显示",
    });
    setExportAnchorEl(null);
  };

  return (
    <>
      <Tooltip
        title="导入导出"
        placement="bottom"
        enterDelay={ENTER_DELAY}
        leaveDelay={LEAVE_DELAY}
      >
        <StyledButton onClick={openModeMenu}>
          导入导出
          <div style={{ position: "absolute", bottom: 2, right: 2 }}>
            <Image src="/icons/corner.svg" alt="logo" width={10} height={10} />
          </div>
        </StyledButton>
      </Tooltip>

      <StyledMenu
        id="export-menu"
        anchorEl={exportAnchorEl}
        open={exportOpen}
        onClose={closeModeMenu}
        disableScrollLock={true}
      >
        <StyledMenuItem style={{ display: "none" }} />
        <StyledMenuItem onClick={handleExport}>导出PDF</StyledMenuItem>
        <StyledMenuItem onClick={saveToLocal}>保存到本地</StyledMenuItem>
        <StyledMenuItem>
          <InputLabel htmlFor="import-file-input">从本地导入</InputLabel>
          <HiddenInput
            accept="application/json"
            id="import-file-input"
            type="file"
            onChange={importFromLocal}
          />
        </StyledMenuItem>
        <StyledMenuItem onClick={openHelpDialog}>帮助</StyledMenuItem>
      </StyledMenu>
    </>
  );
};

export default observer(Export);
